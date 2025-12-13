"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";
import { INSURANCE_REGISTRY_ADDRESS } from "@/contracts/deployed";
import InsuranceRegistryABI from "@/lib/abi/InsuranceRegistry.json";

export interface Policy {
  farmer: string;
  region: string;
  crop: string;
  startDate: number;
  endDate: number;
  active: boolean;
}

export function useInsuranceContract() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { authenticated, user } = usePrivy();
  const { wallets } = useWallets();
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authenticated && wallets[0]) {
      const wallet = wallets[0];
      wallet.getEthereumProvider().then((provider) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ethersProvider = new ethers.BrowserProvider(provider as any);
        ethersProvider.getSigner().then((signer) => {
          const contractInstance = new ethers.Contract(
            INSURANCE_REGISTRY_ADDRESS,
            InsuranceRegistryABI,
            signer
          );
          setContract(contractInstance);
        });
      });
    }
  }, [authenticated, wallets]);

  const createPolicy = useCallback(
    async (region: string, crop: string, startDate: number, endDate: number) => {
      if (!contract) throw new Error("Contract not initialized");
      
      setLoading(true);
      try {
        const tx = await contract.createPolicy(region, crop, startDate, endDate);
        await tx.wait();
        return tx.hash;
      } finally {
        setLoading(false);
      }
    },
    [contract]
  );

  const getPoliciesByFarmer = useCallback(
    async (farmerAddress: string): Promise<number[]> => {
      if (!contract) throw new Error("Contract not initialized");
      
      try {
        const policyIds = await contract.getPoliciesByFarmer(farmerAddress);
        return policyIds.map((id: bigint) => Number(id));
      } catch (error) {
        console.error("Error fetching policies:", error);
        return [];
      }
    },
    [contract]
  );

  const getPolicy = useCallback(
    async (policyId: number): Promise<Policy> => {
      if (!contract) throw new Error("Contract not initialized");
      
      const policy = await contract.policies(policyId);
      return {
        farmer: policy[0],
        region: policy[1],
        crop: policy[2],
        startDate: Number(policy[3]),
        endDate: Number(policy[4]),
        active: policy[5],
      };
    },
    [contract]
  );

  const getPolicyCount = useCallback(async (): Promise<number> => {
    if (!contract) throw new Error("Contract not initialized");
    
    const count = await contract.policyCount();
    return Number(count);
  }, [contract]);

  return {
    contract,
    loading,
    createPolicy,
    getPoliciesByFarmer,
    getPolicy,
    getPolicyCount,
    isConnected: authenticated && contract !== null,
    walletAddress: wallets[0]?.address,
  };
}