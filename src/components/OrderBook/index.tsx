import { useState, useEffect } from "react"
import { toPercent } from "../../helpers/helpers"
import { useSubscribeOrderWorker }  from "../../hooks/useSubscribeOrderWorker"
import { OrderBookTable } from "../OrderBookTable"
import styles from "./styles.module.css"

export const OrderBook = () => {

    const { asks, bids, pair, subscribe } = useSubscribeOrderWorker()

    const haveAsks: boolean = Boolean(asks.length > 0)
    const haveBids: boolean = Boolean(bids.length > 0)
    const totalAsks: number = haveAsks ? asks[asks.length-1].total : 0
    const totalBids: number = haveBids ? bids[bids.length-1].total : 0
    const spread: number = (haveAsks && haveBids) ? asks?.[0].price - bids[0].price : 0
    const spreadPercent: string = spread ? toPercent(spread/asks[0].price) : ''

    const togglePair = () => {
        subscribe(pair === "PI_XBTUSD" ? "PI_ETHUSD" : "PI_XBTUSD")
    }

    return (
        <div className={styles.orderbook}>
            <div className={styles.header}>
                <div className={styles.title}>Order Book 
                    <span className={styles.pair}> ({pair})</span>
                </div>
                <div className={styles.spread}>Spread: {`${spread.toFixed(2)} (${spreadPercent})`}</div>
            </div>
            <OrderBookTable orderType="bid" orders={bids} total={totalBids}/>
            <OrderBookTable orderType="ask" orders={asks} total={totalAsks}/>
            <div className={styles.footer}>
                <button className={styles.toggle} onClick={togglePair}>Toggle Feed</button>
            </div>
        </div>
    )
}
