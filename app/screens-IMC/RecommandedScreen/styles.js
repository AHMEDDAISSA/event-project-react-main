import { StyleSheet } from "react-native";

export default StyleSheet.create({
  contentContact: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    gap: 8,
  },
  card: {
    borderRadius: 8,
    marginHorizontal: 2,
    marginBottom: 10,
    borderWidth: 0.5,
  },
  tag: {
    flexBasis: "31%",
    flexGrow: 1,
    minHeight: 48,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  searchText: {
    fontSize: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  iconWithText: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },

  iconText: {
    marginLeft: 4,
    fontSize: 11,
  },
});
