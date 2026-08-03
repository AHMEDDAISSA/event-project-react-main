import { StyleSheet } from "react-native";

export default StyleSheet.create({
  contentContact: {
    flexDirection: "row",
    padding: 10,
    gap: 8,
  },

  actionButton: {
    flex: 1,
    height: 46,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },

  actionButtonText: {
    marginLeft: 5,
    fontSize: 11,
    flexShrink: 1,
  },
});
