import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BaseColor, useFont, useTheme } from "../config";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Icon } from "../components";
/* Stack Screen */
import Setting from "../screens/Setting";
import ChangeLanguage from "../screens/ChangeLanguage";
import ThemeSetting from "../screens/ThemeSetting";
import HotelDetail from "../screens/HotelDetail";
import HotelInformation from "../screens/HotelInformation";
import PostDetail from "../screens/PostDetail";
import ContactUs from "../screens/ContactUs";
import PreviewBooking from "../screens/PreviewBooking";
import Profile1 from "../screens/Profile1";
import Messages from "../screens/Messages";
import Profile3 from "../screens/Profile3";
import CheckOut from "../screens/CheckOut";
import TourDetail from "../screens/TourDetail";
import PricingTable from "../screens/PricingTable";
import PricingTableIcon from "../screens/PricingTableIcon";
import EventTicket from "../screens/EventTicket";
import BusTicket from "../screens/BusTicket";
import PaymentMethod from "../screens/PaymentMethod";
import PreviewPayment from "../screens/PreviewPayment";
import BookingDetail from "../screens/BookingDetail";
import Post from "../screens/Post";
import Profile from "../screens-IMC/Profile";
import HomeScreen from "../screens-IMC/HomeScreen";
import RepresentativesScreen from "../screens-IMC/RepresentativesScreen";
import ConferencesScreen from "../screens-IMC/ConferencesScreen";
import InterestsScreen from "../screens-IMC/InterestsScreen";
import RecommandedScreen from "../screens-IMC/RecommandedScreen";
import InterestedInYouScreen from "../screens-IMC/InterestedInYouScreen";
import MyConnectionsScreen from "../screens-IMC/MyConnectionsScreen";
import MyScheduleScreen from "../screens-IMC/MyScheduleScreen";
import ExhibitorDetail from "../screens-IMC/ExhibitorDetail";
import ConferenceDetails from "../screens-IMC/ConferenceDetails";
import RequestAmeeting from "../screens-IMC/RequestAmeeting";
import RequestAVMeeting from "../screens-IMC/RequestAVMeeting";
import ExhibitorsScreen from "../screens-IMC/ExhibitorsScreen";
import VisitorsScreen from "../screens-IMC/VisitorsScreen";
import VisitorDetail from "../screens-IMC/VisitorDetail";
import MyConnectionsVMScreen from "../screens-IMC/MyConnectionsVMScreen";
import UpdateAppScreen from "../screens-IMC/UpdateAppScreen";
import Notification from "../screens-IMC/Notification";
import ChangePassword from "../screens-IMC/ChangePassword";
import ProfileEdit from "../screens-IMC/ProfileEdit";
import NoInternetScreen from "../screens-IMC/NoInternetScreen";
import SponsorDetail from "../screens-IMC/SponsorDetail";
import MySpeakersScreen from "../screens-IMC/MySpeakersScreen";
import QRScannerScreen from "../screens-IMC/QRScannerScreen";

const MainStack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();

export default function Main() {
  const { type } = useSelector((state) => state.auth);

  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="BottomTabNavigator"
    >
      <MainStack.Screen
        name="BottomTabNavigator"
        component={BottomTabNavigator}
      />
      <MainStack.Screen name="Profile1" component={Profile1} />
      <MainStack.Screen name="Profile3" component={Profile3} />
      <MainStack.Screen name="Messages" component={Messages} />
      <MainStack.Screen name="ChangeLanguage" component={ChangeLanguage} />
      <MainStack.Screen name="HotelInformation" component={HotelInformation} />
      <MainStack.Screen name="CheckOut" component={CheckOut} />
      <MainStack.Screen name="HotelDetail" component={HotelDetail} />
      <MainStack.Screen name="ContactUs" component={ContactUs} />
      <MainStack.Screen name="PreviewBooking" component={PreviewBooking} />
      <MainStack.Screen name="PricingTable" component={PricingTable} />
      <MainStack.Screen name="PricingTableIcon" component={PricingTableIcon} />
      <MainStack.Screen name="BookingDetail" component={BookingDetail} />
      <MainStack.Screen name="PostDetail" component={PostDetail} />
      <MainStack.Screen name="TourDetail" component={TourDetail} />
      <MainStack.Screen name="BusTicket" component={BusTicket} />
      <MainStack.Screen name="EventTicket" component={EventTicket} />
      <MainStack.Screen name="PaymentMethod" component={PaymentMethod} />
      <MainStack.Screen name="PreviewPayment" component={PreviewPayment} />
      <MainStack.Screen name="Post" component={Post} />
      <MainStack.Screen name="Setting" component={Setting} />
      <MainStack.Screen name="ThemeSetting" component={ThemeSetting} />
      <MainStack.Screen
        name="RepresentativesScreen"
        component={RepresentativesScreen}
      />
      <MainStack.Screen
        name="InterestedInYou"
        component={InterestedInYouScreen}
      />
      <MainStack.Screen name="MyConnections" component={MyConnectionsScreen} />
      <MainStack.Screen
        name="MyConnectionsVM"
        component={MyConnectionsVMScreen}
      />
      <MainStack.Screen name="MySchedule" component={MyScheduleScreen} />
      <MainStack.Screen name="ExhibitorDetail" component={ExhibitorDetail} />
      <MainStack.Screen name="RequestAmeeting" component={RequestAmeeting} />
      <MainStack.Screen
        name="ConferenceDetails"
        component={ConferenceDetails}
      />
      <MainStack.Screen name="VisitorDetail" component={VisitorDetail} />
      <MainStack.Screen name="RequestAVMeeting" component={RequestAVMeeting} />
      {type == "exhibitor" && (
        <MainStack.Screen name="InterestsScreen" component={InterestsScreen} />
      )}
      <MainStack.Screen name="UpdateAppScreen" component={UpdateAppScreen} />
      <MainStack.Screen name="Notification" component={Notification} />
      <MainStack.Screen name="ChangePassword" component={ChangePassword} />
      <MainStack.Screen name="ProfileEdit" component={ProfileEdit} />
      <MainStack.Screen name="NoInternetScreen" component={NoInternetScreen} />
      <MainStack.Screen name="SponsorDetail" component={SponsorDetail} />
      <MainStack.Screen name="MySpeakersScreen" component={MySpeakersScreen} />
      <MainStack.Screen name="QRScannerScreen" component={QRScannerScreen} />
    </MainStack.Navigator>
  );
}

function BottomTabNavigator() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const font = useFont();
  const { type, permissions } = useSelector((state) => state.auth);

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarInactiveTintColor: BaseColor.grayColor,
        tabBarActiveTintColor: colors.primary,
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: font,
          paddingBottom: 2,
        },
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: t("home"),
          tabBarIcon: ({ color }) => {
            return <Icon color={color} name="home" size={20} solid />;
          },
        }}
      />
      {type == "exhibitor" ? (
        <BottomTab.Screen
          name="Exhibitors"
          component={ExhibitorsScreen}
          options={{
            title: t("exhibitors"),
            tabBarIcon: ({ color }) => {
              return <Icon color={color} name="people" size={20} solid />;
            },
          }}
        />
      ) : (
        <BottomTab.Screen
          name="RecommandedForYou"
          component={RecommandedScreen}
          options={{
            title: t("recommanded_for_you"),
            tabBarIcon: ({ color }) => {
              return <Icon color={color} name="thumb-up" size={20} solid />;
            },
          }}
        />
      )}

      {type == "exhibitor" ? (
        <BottomTab.Screen
          name="Visitors"
          component={VisitorsScreen}
          options={{
            title: t("visitors"),
            tabBarIcon: ({ color }) => {
              return (
                <Icon solid color={color} name="people-outline" size={20} />
              );
            },
          }}
        />
      ) : (
        <BottomTab.Screen
          name="InterestsScreen"
          component={InterestsScreen}
          options={{
            title: t("my_interests"),
            tabBarIcon: ({ color }) => {
              return <Icon solid color={color} name="check-circle" size={20} />;
            },
          }}
        />
      )}

      {permissions?.includes("conferences") && (
        <BottomTab.Screen
          name="ConferencesScreen"
          component={ConferencesScreen}
          options={{
            title: t("conferences"),
            tabBarIcon: ({ color }) => {
              return (
                <Icon color={color} name="calendar-month" size={20} solid />
              );
            },
          }}
        />
      )}
      <BottomTab.Screen
        name="Profile"
        component={Profile}
        options={{
          title: t("more"),
          tabBarIcon: ({ color }) => {
            return <Icon solid color={color} name="menu" size={20} />;
          },
        }}
      />
    </BottomTab.Navigator>
  );
}
