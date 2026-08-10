import { StyleSheet } from "react-native";

export default StyleSheet.create({
  contentContact: {
    flexDirection: "row",
    padding: 10,
    gap: 8,
  },

  actionButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderBottomWidth: 3,
    borderBottomColor: "#3730A3",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },

  actionButtonText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.2,
    flexShrink: 1,
  },
});
