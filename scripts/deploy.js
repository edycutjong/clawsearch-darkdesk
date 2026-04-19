/* eslint-disable @typescript-eslint/no-require-imports */
const hre = require("hardhat");

async function main() {
  console.log("🛡️  Deploying DarkDeskEscrow to", hre.network.name, "...\n");

  const DarkDeskEscrow = await hre.ethers.getContractFactory("DarkDeskEscrow");
  const escrow = await DarkDeskEscrow.deploy();
  await escrow.waitForDeployment();

  const address = await escrow.getAddress();

  console.log("✅ DarkDeskEscrow deployed to:", address);
  console.log("\n📋 Next steps:");
  console.log(`   1. Update .env.local:`);
  console.log(`      NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS=${address}`);
  console.log(
    `   2. Verify on Arbiscan: https://sepolia.arbiscan.io/address/${address}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
