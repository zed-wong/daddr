// src/core/HDWallet.ts
import { DeriveParams } from "../utils/derivation.js";
import { ChainManager } from "./ChainManager.js";
import Big from "big.js";

/**
 * HDWallet wraps a master seed and provides unified derive/send/subscribe APIs
 */
export class HDWallet {
  constructor(private masterSeed: Uint8Array) {}

  /**
   * Derive an address for a given chain and parameters
   */
  async deriveAddress(params: DeriveParams): Promise<string> {
    const adapter = ChainManager.getAdapter(params.chain);
    return adapter.deriveAddress(params);
  }

  async balance(params: DeriveParams): Promise<Big> {
    const adapter = ChainManager.getAdapter(params.chain);
    return adapter.balance(params);
  }

  /**
   * Send native asset from a derived address on a given chain
   */
  async send(
    params: DeriveParams,
    to: string,
    amount: Big
  ): Promise<{ txHash: string }> {
    const adapter = ChainManager.getAdapter(params.chain);
    return adapter.send(params, to, amount);
  }

  /**
   * Subscribe to incoming transfers for a derived address
   */
  async subscribe(
    params: DeriveParams,
    onIncoming: (txHash: string, amount: Big) => void
  ): Promise<{ unsubscribe: () => void }> {
    const address = await this.deriveAddress(params);
    const adapter = ChainManager.getAdapter(params.chain);
    return adapter.subscribe(address, onIncoming);
  }
}
