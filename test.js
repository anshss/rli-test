import { LitContracts } from "@lit-protocol/contracts-sdk";
import { LitNetwork } from "@lit-protocol/constants";
import { ethers } from "ethers";

async function testRliSDK() {
    const litContracts = new LitContracts({
        network: LitNetwork.Datil,
    });

    await litContracts.connect();

    const maxReqKs =
        await litContracts.rateLimitNftContract.read.maxRequestsPerKilosecond();
    console.log("maxReq ", ethers.BigNumber.from(maxReqKs).toString());

    const totalReqKs =
        await litContracts.rateLimitNftContract.read.currentSoldRequestsPerKilosecond();
    console.log("currSoldReq ", ethers.BigNumber.from(totalReqKs).toString());

    const eqn = maxReqKs - totalReqKs;
    console.log("eqn ", eqn);

    const checkEqn =
        await litContracts.rateLimitNftContract.read.checkBelowMaxRequestsPerKilosecond(
            eqn.toString()
        );
    console.log("checkEqn (=?) ", checkEqn);

    let satisfyingValue = 0;

    for (let i = 0; i < 100; i++) {
        const checkSatisfyingValueLesser =
            await litContracts.rateLimitNftContract.read.checkBelowMaxRequestsPerKilosecond(
                (eqn - i).toString()
            );
        console.log("checkEqn (<) ", checkSatisfyingValueLesser);
        if (checkSatisfyingValueLesser == true) {
            satisfyingValue = eqn - i;
            break;
        }
    }

    console.log("satisfyingValue ", satisfyingValue);

    const confirmOnSatisfyingValue =
        await litContracts.rateLimitNftContract.read.checkBelowMaxRequestsPerKilosecond(
            satisfyingValue.toString()
        );
    console.log("checkEqn (=) ", confirmOnSatisfyingValue);
}

testRliSDK();
