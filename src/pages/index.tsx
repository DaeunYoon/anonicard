import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'

import alchemy from '~/alchemy'
import { useAccount } from 'wagmi'
import { IDKitWidget } from '@worldcoin/idkit'
import type { ISuccessResult } from '@worldcoin/idkit'

import Box from '~/components/Common/Box'
import Button from '~/components/Common/Button'
import OriginalForm from '~/components/OriginalForm'
import useUserOwnedNfts from '~/hooks/useUserOwnedNfts'

interface OriginalNFT {
  tokenId: string
  profileImage?: string
  fullName: string
  discordName: string
  job: number
  introduction: string
}

// const IDKitWidget = dynamic(
//   () => import('@worldcoin/idkit').then((mod) => mod.IDKitWidget),
//   { ssr: false }
// )

const WORLDCOIN_ID = process.env.NEXT_PUBLIC_WORLDCOIN_ID

export default function Home() {
  const { address } = useAccount()

  const {
    nfts: originalNFTs,
    isLoadingNFTs,
    getUserOwnedNfts,
  } = useUserOwnedNfts<OriginalNFT>('originalAnoni')

  useEffect(() => {
    getUserOwnedNfts()
  }, [])

  const handleProof = useCallback((result: ISuccessResult) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 3000)
    })
  }, [])

  const onSuccess = (result: ISuccessResult) => {
    console.log(result)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4">
      <Box classes="bg-beige">
        {isLoadingNFTs ? (
          'Loading ... '
        ) : originalNFTs.length ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={originalNFTs[0].profileImage} alt="profile" />
            <table>
              <tbody className="divide-y-2 divide-solid div-">
                <tr>
                  <th>Full Name</th>
                  <td>{originalNFTs[0].fullName}</td>
                </tr>
                <tr>
                  <th>Discord Name</th>
                  <td>{originalNFTs[0].discordName}</td>
                </tr>
                <tr>
                  <th>Job</th>
                  <td>{originalNFTs[0].job}</td>
                </tr>
                <tr>
                  <th>Introduction</th>
                  <td>{originalNFTs[0].introduction}</td>
                </tr>
              </tbody>
            </table>
          </>
        ) : (
          <IDKitWidget
            action="verifyhuman"
            onSuccess={(result) => console.log(result)}
            handleVerify={handleProof}
            app_id={WORLDCOIN_ID} // obtain this from developer.worldcoin.org
          >
            {({ open }) => <Button onClick={open}>Click me</Button>}
          </IDKitWidget>
        )}
      </Box>
    </main>
  )
}
