"use client";

import { useInsuranceContract } from "./useInsuranceContract";
import { useCallback, useEffect, useState } from "react";
import type { Policy } from "./useInsuranceContract";

export function useFarmerProfile() {
  const { getPoliciesByFarmer, getPolicy, walletAddress, isConnected } =
    useInsuranceContract();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  const loadProfile = useCallback(async () => {
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
  }, [isConnected, walletAddress, getPoliciesByFarmer, getPolicy]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    policies,
    loading,
    hasProfile,
    refresh: loadProfile,
  };
}