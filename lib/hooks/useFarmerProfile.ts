"use client";

import { useInsuranceContract } from "./useInsuranceContract";
import { useEffect, useState } from "react";
import type { Policy } from "./useInsuranceContract";

export function useFarmerProfile() {
  const { getPoliciesByFarmer, getPolicy, walletAddress, isConnected } =
    useInsuranceContract();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    if (!isConnected || !walletAddress) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const loadProfile = async () => {
      try {
        const policyIds = await getPoliciesByFarmer(walletAddress);
        
        if (policyIds.length > 0) {
          setHasProfile(true);
          const policyPromises = policyIds.map((id) => getPolicy(id));
          const loadedPolicies = await Promise.all(policyPromises);
          setPolicies(loadedPolicies);
        } else {
          setHasProfile(false);
          setPolicies([]);
        }
      } catch (error) {
        console.error("Error loading farmer profile:", error);
        setHasProfile(false);
        setPolicies([]);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
    // Only depend on stable values to prevent infinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, walletAddress]);

  const refresh = async () => {
    if (!isConnected || !walletAddress) return;

    setLoading(true);
    try {
      const policyIds = await getPoliciesByFarmer(walletAddress);
      
      if (policyIds.length > 0) {
        setHasProfile(true);
        const policyPromises = policyIds.map((id) => getPolicy(id));
        const loadedPolicies = await Promise.all(policyPromises);
        setPolicies(loadedPolicies);
      } else {
        setHasProfile(false);
        setPolicies([]);
      }
    } catch (error) {
      console.error("Error loading farmer profile:", error);
      setHasProfile(false);
      setPolicies([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    policies,
    loading,
    hasProfile,
    refresh,
  };
}