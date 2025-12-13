"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";
import { INSURANCE_REGISTRY_ADDRESS, SEPOLIA_CHAIN_ID } from "@/contracts/deployed";
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
    let cancelled = false;

    const setupContract = async () => {
      if (!authenticated || !wallets[0]) {
        setContract(null);
        return;
      }

      const wallet = wallets[0];
      const provider = await wallet.getEthereumProvider();

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const requestFn = (provider as any).request?.bind(provider as any);

        if (requestFn) {
          const chainIdHex = await requestFn({ method: "eth_chainId" });
          const currentChainId = parseInt(String(chainIdHex), 16);

          if (currentChainId !== SEPOLIA_CHAIN_ID) {
            try {
              await requestFn({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: "0xaa36a7" }], // Sepolia
              });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (switchError: any) {
              if (switchError?.code === 4902) {
                try {
                  await requestFn({
                    method: "wallet_addEthereumChain",
                    params: [
                      {
                        chainId: "0xaa36a7",
                        chainName: "Sepolia",
                        nativeCurrency: {
                          name: "SepoliaETH",
                          symbol: "SepoliaETH",
                          decimals: 18,
                        },
                        rpcUrls: ["https://ethereum-sepolia-rpc.publicnode.com"],
                        blockExplorerUrls: ["https://sepolia.etherscan.io"],
                      },
                    ],
                  });
                } catch (addError) {
                  console.warn("User rejected adding Sepolia network", addError);
                  setContract(null);
                  return;
                }
              } else {
                console.warn("User rejected switching to Sepolia", switchError);
                setContract(null);
                return;
              }
            }
          }
        }
      } catch (networkError) {
        console.warn("Failed to verify or switch network", networkError);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ethersProvider = new ethers.BrowserProvider(provider as any);
      const signer = await ethersProvider.getSigner();
      if (cancelled) return;

      const contractInstance = new ethers.Contract(
        INSURANCE_REGISTRY_ADDRESS,
        InsuranceRegistryABI,
        signer
      );
      setContract(contractInstance);
    };

    setupContract();

    return () => {
      cancelled = true;
    };
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