import {
  Alert,
  Linking,
  NativeModules,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { FileViewer } from './platformImports';
import {Buffer} from 'buffer';
import * as FileSystem from 'expo-file-system/legacy';
import * as XLSX from 'xlsx';
import * as Sharing from 'expo-sharing';

const {OpenFileModule} = NativeModules;

const arrayBufferToBase64 = buffer => {
  const uint8Array = new Uint8Array(buffer);
  const bufferData = Buffer.from(uint8Array);
  return bufferData.toString('base64');
};

const getDownloadPath = async (fileName) => {
  if (Platform.OS === 'android') {
    console.log("1", `${FileSystem.documentDirectory}${fileName}`);
    return `${FileSystem.documentDirectory}${fileName}`;
  } else {
    console.log("2", `${FileSystem.documentDirectory}${fileName}`);
    
    return `${FileSystem.documentDirectory}${fileName}`;
  }
};

const sanitizeSheetName = name =>
  name.replace(/[:\\/?*\[\]]/g, '').substring(0, 31);

const sanitizeFileName = name =>
  name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9-_]/g, '_');

const canOpenFile = async (filePath, mimeType) => {
  try {
    if (Platform.OS === 'android') {
      // Use Linking as a quick check
      const canOpen = await Linking.canOpenURL(`file://${filePath}`);
      return canOpen;
    } else {
      return await Linking.canOpenURL(filePath);
    }
  } catch (err) {
    console.warn('Error checking file:', err);
    return false;
  }
};

const openExcelFile = async filePath => {
  const mimeType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

  try {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const hasApp = await canOpenFile(filePath, mimeType);
      if (hasApp) {
        await OpenFileModule.openFile(filePath, mimeType);
      } else {
        Alert.alert(
          'Aucune application trouvée',
          'Aucune application ne peut ouvrir ce fichier Excel. Veuillez installer Microsoft Excel ou Google Sheets.',
          [
            {
              text: 'Installer Excel',
              onPress: () =>
                Linking.openURL(
                  'https://play.google.com/store/apps/details?id=com.microsoft.office.excel',
                ),
            },
            {
              text: 'Installer Sheets',
              onPress: () =>
                Linking.openURL(
                  'https://play.google.com/store/apps/details?id=com.google.android.apps.docs.editors.sheets',
                ),
            },
            {text: 'Annuler', style: 'cancel'},
          ],
        );
      }
    } else {
      // Older Android or iOS: fallback to FileViewer
      await FileViewer.open(filePath);
    }
  } catch (err) {
    console.error('Error opening Excel:', err);

    Alert.alert(
      'Impossible d’ouvrir le fichier',
      'Aucune application ne peut ouvrir ce fichier Excel. Vous pouvez retrouver le fichier dans le dossier Téléchargements.',
      [
        {
          text: 'Ouvrir le dossier',
          onPress: async () => {
            // Open Downloads folder (Android only)
            if (Platform.OS === 'android') {
              const downloadsUri =
                'content://com.android.externalstorage.documents/document/primary:Download';
              Linking.openURL(downloadsUri);
            }
          },
        },
        {
          text: 'Installer Excel',
          onPress: () =>
            Linking.openURL(
              'https://play.google.com/store/apps/details?id=com.microsoft.office.excel',
            ),
        },
        {
          text: 'Installer Sheets',
          onPress: () =>
            Linking.openURL(
              'https://play.google.com/store/apps/details?id=com.google.android.apps.docs.editors.sheets',
            ),
        },
        {text: 'OK', style: 'cancel'},
      ],
    );
  }
};

export const generateExcelFileAndOpenIt = async (
  excelData,
  filname,
  successMessage,
) => {
  if (Platform.OS === 'android') {
    if (Platform.Version < 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert(
          'Permission refusée',
          'Impossible de sauvegarder le fichier Excel.',
        );
        return;
      }
    }

    try {
      const ws = XLSX.utils.aoa_to_sheet(excelData);
      const wb = XLSX.utils.book_new();
      const sheetName = sanitizeSheetName(filname);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);

      const wbout = XLSX.write(wb, {bookType: 'xlsx', type: 'array'});
      const base64Data = arrayBufferToBase64(wbout);

      // 3 - Determine file path
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = sanitizeFileName(`${filname}-${timestamp}`) + `.xlsx`;
      const filePath = await getDownloadPath(fileName);

      // 4 - Write file
       // 4 - Write file using Expo FileSystem
      await FileSystem.writeAsStringAsync(filePath, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });
      // 5 - Notify user that download succeeded
      Alert.alert('Téléchargement terminé', successMessage, [
        {
          text: 'Ouvrir',
          onPress: async () => openExcelFile(filePath),
        },
        {
          text: 'OK',
          style: 'cancel',
        },
      ]);
    } catch (error) {
      console.error('Error on generating or opening excel file:', error);
      Alert.alert(
        'Erreur',
        'Un problème est survenu lors du téléchargement du fichier.',
      );
    }
  } else if (Platform.OS === 'ios') {
    try {
      const ws = XLSX.utils.aoa_to_sheet(excelData);
      const wb = XLSX.utils.book_new();
      const sheetName = sanitizeSheetName(filname);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
      const wbout = XLSX.write(wb, {bookType: 'xlsx', type: 'base64'});
      // Define file path
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = sanitizeFileName(`${filname}-${timestamp}`) + `.xlsx`;
      const fileUri = FileSystem.documentDirectory + fileName;
      await FileSystem.writeAsStringAsync(fileUri, wbout, {
        encoding: FileSystem.EncodingType.Base64,
      });
      // Share the file
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        dialogTitle: 'Share Excel File',
        UTI: 'com.microsoft.excel.xlsx',
      });
    } catch (error) {
      console.error('Error on generating or opening excel file:', error);
      Alert.alert(
        'Erreur',
        'Une erreur est survenue lors de la génération du fichier Excel.',
      );
    }
  }
};
