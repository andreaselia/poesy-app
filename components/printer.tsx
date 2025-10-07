import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
} from "react-native-reanimated";

// Simple Check icon component
const CheckIcon = () => (
  <View style={styles.checkIcon}>
    <Text style={styles.checkText}>✓</Text>
  </View>
);

export default function Printer() {
  const [isPrinting, setIsPrinting] = React.useState(false);
  const [showPaper, setShowPaper] = React.useState(false);

  // Animated values
  const paperY = useSharedValue(-550);
  const lightOpacity = useSharedValue(1);

  const handlePrint = () => {
    if (isPrinting) return;

    setIsPrinting(true);
    setShowPaper(true);

    // Start paper animation
    paperY.value = withTiming(0, {
      duration: 2500,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });

    // Start blinking light
    lightOpacity.value = withRepeat(
      withTiming(0.3, { duration: 500 }),
      -1,
      true,
    );

    // Reset after animation completes
    setTimeout(() => {
      setIsPrinting(false);
      lightOpacity.value = withTiming(1, { duration: 200 });
    }, 3000);
  };

  const handleReset = () => {
    setShowPaper(false);
    paperY.value = -550;
    lightOpacity.value = 1;
  };

  // Animated styles
  const paperAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: paperY.value }],
  }));

  const lightAnimatedStyle = useAnimatedStyle(() => ({
    opacity: isPrinting ? lightOpacity.value : 1,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.printerContainer}>
          <View style={styles.printerBody}>
            <View style={styles.topHighlight} />

            <Text style={styles.brandName}>e-print</Text>

            <View style={styles.statusLights}>
              <Animated.View
                style={[
                  styles.statusLight,
                  styles.greenLight,
                  lightAnimatedStyle,
                ]}
              />
              <View style={[styles.statusLight, styles.grayLight]} />
              <View style={[styles.statusLight, styles.grayLight]} />
            </View>

            <View style={styles.paperSlot} />
          </View>

          {showPaper && (
            <Animated.View style={[styles.paper, paperAnimatedStyle]}>
              <View style={styles.paperContent}>
                <View style={styles.successIconContainer}>
                  <View style={styles.successIcon}>
                    <CheckIcon />
                  </View>
                </View>

                <View style={styles.receiptContent}>
                  <Text style={styles.receiptTitle}>Payment Successful</Text>
                  <Text style={styles.receiptDate}>13th May, 2025 07:30pm</Text>

                  <View style={styles.itemsList}>
                    <View style={styles.itemRow}>
                      <Text style={styles.itemText}>1x Bowl of Tofu</Text>
                      <Text style={styles.itemPrice}>₦8,000.00</Text>
                    </View>
                    <View style={styles.itemRow}>
                      <Text style={styles.itemText}>1x Can Diet Coke</Text>
                      <Text style={styles.itemPrice}>₦900.00</Text>
                    </View>
                    <View style={styles.itemRow}>
                      <Text style={styles.itemText}>1x Fried Rice</Text>
                      <Text style={styles.itemPrice}>₦1,800.00</Text>
                    </View>
                  </View>

                  <View style={styles.subtotalSection}>
                    <View style={styles.dashedBorder} />
                    <View style={styles.subtotalRow}>
                      <Text style={styles.subtotalText}>Subtotal</Text>
                      <Text style={styles.subtotalPrice}>₦10,700.00</Text>
                    </View>
                    <View style={styles.subtotalRow}>
                      <Text style={styles.subtotalText}>VAT (9%)</Text>
                      <Text style={styles.subtotalPrice}>₦963.00</Text>
                    </View>
                    <View style={styles.subtotalRow}>
                      <Text style={styles.subtotalText}>Service Fee</Text>
                      <Text style={styles.subtotalPrice}>₦2,000.00</Text>
                    </View>
                  </View>

                  <View style={styles.totalSection}>
                    <View style={styles.solidBorder} />
                    <View style={styles.totalRow}>
                      <Text style={styles.totalText}>TOTAL</Text>
                      <Text style={styles.totalPrice}>₦13,663.00</Text>
                    </View>
                  </View>

                  <Text style={styles.thankYou}>👋 THANK YOU</Text>
                </View>
              </View>
            </Animated.View>
          )}
        </View>

        <View style={styles.controls}>
          <TouchableOpacity
            style={[
              styles.button,
              styles.primaryButton,
              isPrinting && styles.disabledButton,
            ]}
            onPress={handlePrint}
            disabled={isPrinting}
          >
            <Text style={[styles.buttonText, styles.primaryButtonText]}>
              {isPrinting ? "Printing..." : "Print Receipt"}
            </Text>
          </TouchableOpacity>

          {showPaper && !isPrinting && (
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handleReset}
            >
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                Reset
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    gap: 32,
  },
  printerContainer: {
    position: "relative",
    alignItems: "center",
  },
  printerBody: {
    width: 400,
    height: 200,
    backgroundColor: "#cbd5e1",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
    overflow: "hidden",
    zIndex: 20,
    position: "relative",
  },
  topHighlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 48,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
  brandName: {
    position: "absolute",
    top: 64,
    left: 32,
    color: "#475569",
    fontFamily: "monospace",
    fontSize: 14,
  },
  statusLights: {
    position: "absolute",
    top: 64,
    right: 32,
    flexDirection: "row",
    gap: 8,
  },
  statusLight: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  greenLight: {
    backgroundColor: "#4ade80",
  },
  grayLight: {
    backgroundColor: "#64748b",
  },
  paperSlot: {
    position: "absolute",
    bottom: 0,
    left: "50%",
    marginLeft: -140,
    width: 280,
    height: 32,
    backgroundColor: "#1e293b",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  paper: {
    position: "absolute",
    top: 168,
    width: 260,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 10,
  },
  paperContent: {
    padding: 32,
  },
  successIconContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  successIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#22c55e",
    alignItems: "center",
    justifyContent: "center",
  },
  checkIcon: {
    alignItems: "center",
    justifyContent: "center",
  },
  checkText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  receiptContent: {
    alignItems: "center",
  },
  receiptTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    fontFamily: "monospace",
  },
  receiptDate: {
    fontSize: 12,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 24,
    fontFamily: "monospace",
  },
  itemsList: {
    width: "100%",
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  itemText: {
    fontSize: 12,
    color: "#475569",
    fontFamily: "monospace",
  },
  itemPrice: {
    fontSize: 12,
    color: "#475569",
    fontFamily: "monospace",
  },
  subtotalSection: {
    width: "100%",
    paddingTop: 12,
    marginBottom: 12,
  },
  dashedBorder: {
    borderTopWidth: 1,
    borderTopColor: "#cbd5e1",
    borderStyle: "dashed",
    marginBottom: 12,
  },
  subtotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  subtotalText: {
    fontSize: 12,
    color: "#475569",
    fontFamily: "monospace",
  },
  subtotalPrice: {
    fontSize: 12,
    color: "#475569",
    fontFamily: "monospace",
  },
  totalSection: {
    width: "100%",
    paddingTop: 8,
    marginBottom: 16,
  },
  solidBorder: {
    borderTopWidth: 2,
    borderTopColor: "#1e293b",
    marginBottom: 8,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalText: {
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "monospace",
  },
  totalPrice: {
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "monospace",
  },
  thankYou: {
    fontSize: 12,
    textAlign: "center",
    fontFamily: "monospace",
  },
  controls: {
    flexDirection: "row",
    gap: 16,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: "#1e293b",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#cbd5e1",
  },
  disabledButton: {
    backgroundColor: "#94a3b8",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  primaryButtonText: {
    color: "white",
  },
  secondaryButtonText: {
    color: "#1e293b",
  },
});
