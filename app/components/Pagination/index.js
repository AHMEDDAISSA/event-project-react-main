import React from 'react';
import {View, TouchableOpacity, ScrollView} from 'react-native';
import {useTheme} from '../../config';
import {Text} from '../index';
import styles from './styles';

const Pagination = ({pagination, onPageChange}) => {
  const {colors} = useTheme();

  const pages = [];
  const maxVisiblePages = 5;
  let startPage, endPage;

  if (pagination.last_page <= maxVisiblePages) {
    startPage = 1;
    endPage = pagination.last_page;
  } else {
    const maxPagesBeforeCurrent = Math.floor(maxVisiblePages / 2);
    const maxPagesAfterCurrent = Math.ceil(maxVisiblePages / 2) - 1;

    if (pagination.current_page <= maxPagesBeforeCurrent) {
      startPage = 1;
      endPage = maxVisiblePages;
    } else if (
      pagination.current_page + maxPagesAfterCurrent >=
      pagination.last_page
    ) {
      startPage = pagination.last_page - maxVisiblePages + 1;
      endPage = pagination.last_page;
    } else {
      startPage = pagination.current_page - maxPagesBeforeCurrent;
      endPage = pagination.current_page + maxPagesAfterCurrent;
    }
  }

  // Add page numbers
  for (let i = startPage; i <= endPage; i++) {
    pages.push(
      <TouchableOpacity
        key={i}
        onPress={() => onPageChange(i)}
        style={[
          styles.pageButton,
          {
            backgroundColor:
              pagination.current_page === i ? colors.primary : colors.card,
          },
        ]}>
        <Text
          style={
            pagination.current_page === i
              ? styles.activePageText
              : styles.pageText
          }>
          {i}
        </Text>
      </TouchableOpacity>,
    );
  }

  return (
    <View style={styles.paginationContainer}>
      <TouchableOpacity
        onPress={() => onPageChange(1)}
        disabled={pagination.current_page === 1}
        style={[styles.pageButton, {backgroundColor: colors.card}]}>
        <Text>{'<<'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onPageChange(Math.max(1, pagination.current_page - 1))}
        disabled={pagination.current_page === 1}
        style={[styles.pageButton, {backgroundColor: colors.card}]}>
        <Text>{'<'}</Text>
      </TouchableOpacity>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {pages}
      </ScrollView>

      <TouchableOpacity
        onPress={() =>
          onPageChange(
            Math.min(pagination.last_page, pagination.current_page + 1),
          )
        }
        disabled={pagination.current_page === pagination.last_page}
        style={[styles.pageButton, {backgroundColor: colors.card}]}>
        <Text>{'>'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onPageChange(pagination.last_page)}
        disabled={pagination.current_page === pagination.last_page}
        style={[styles.pageButton, {backgroundColor: colors.card}]}>
        <Text>{'>>'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Pagination;
