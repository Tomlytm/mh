import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import colors from '../config/colors';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
}) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animateOpacity = () => {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start(() => animateOpacity());
    };

    animateOpacity();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity,
        },
        style,
      ]}
    />
  );
};

export const TripCardSkeleton: React.FC = () => {
  return (
    <View style={styles.tripCardContainer}>
      <View style={styles.tripCardContent}>
        <SkeletonLoader width={40} height={40} borderRadius={20} />
        <View style={styles.tripCardText}>
          <SkeletonLoader width="60%" height={16} style={{ marginBottom: 8 }} />
          <SkeletonLoader width="80%" height={14} />
        </View>
        <SkeletonLoader width={24} height={24} borderRadius={12} />
      </View>
    </View>
  );
};

export const DetailedTripCardSkeleton: React.FC = () => {
  return (
    <View style={styles.detailedTripContainer}>
      <View style={styles.detailedTripHeader}>
        <View>
          <SkeletonLoader width="40%" height={12} style={{ marginBottom: 6 }} />
          <SkeletonLoader width="60%" height={16} />
        </View>
        <View>
          <SkeletonLoader width="50%" height={12} style={{ marginBottom: 6 }} />
          <SkeletonLoader width="70%" height={16} />
        </View>
      </View>
      
      <View style={styles.detailedTripBody}>
        <SkeletonLoader width={28} height={28} borderRadius={14} />
        <View style={styles.detailedTripAddress}>
          <SkeletonLoader width="30%" height={12} style={{ marginBottom: 6 }} />
          <SkeletonLoader width="90%" height={14} style={{ marginBottom: 4 }} />
          <SkeletonLoader width="70%" height={14} />
        </View>
      </View>
      
      <View style={styles.detailedTripFooter}>
        <View style={styles.detailedTripCustomer}>
          <SkeletonLoader width={40} height={40} borderRadius={20} />
          <View style={styles.detailedTripCustomerInfo}>
            <SkeletonLoader width="60%" height={14} style={{ marginBottom: 4 }} />
            <SkeletonLoader width="50%" height={12} />
          </View>
        </View>
        <View style={styles.detailedTripPrice}>
          <SkeletonLoader width="40%" height={12} style={{ marginBottom: 4 }} />
          <SkeletonLoader width="50%" height={16} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.border,
  },
  tripCardContainer: {
    backgroundColor: colors.secondary,
    borderRadius: 16,
    padding: 16,
    marginVertical: 6,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tripCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tripCardText: {
    flex: 1,
    paddingLeft: 12,
    paddingRight: 8,
  },
  detailedTripContainer: {
    borderRadius: 16,
    marginVertical: 8,
    backgroundColor: colors.secondary,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  detailedTripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    marginTop: 8,
  },
  detailedTripBody: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  detailedTripAddress: {
    flex: 1,
    marginLeft: 12,
  },
  detailedTripFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  detailedTripCustomer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailedTripCustomerInfo: {
    marginLeft: 12,
    flex: 1,
  },
  detailedTripPrice: {
    alignItems: 'flex-end',
  },
});