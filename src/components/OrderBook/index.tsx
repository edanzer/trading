import { useState, useEffect } from "react"
import { toPercent } from "../../helpers/helpers"
import { useSubscribeOrderWorker }  from "../../hooks/useSubscribeOrderWorker"
import { OrderBookTable } from "../OrderBookTable"

// Import Styles
import styles from "./styles.module.css"

export const OrderBook = () => {

    const { asks, bids, pair, subscribe } = useSubscribeOrderWorker()

    const [ spread, setSpread ] = useState<number>(0)
    const [ spreadPercent, setSpreadPercent ] = useState<string>('')
    const [ totalAsks, setTotalAsks ] = useState<number>(0)
    const [ totalBids, setTotalBids ] = useState<number>(0)
    
    useEffect(() => {
        if (asks[0] && bids[0]) {
            setSpread(asks[0].price - bids[0].price)
            setTotalAsks(asks[asks.length-1].total)
            setTotalBids(bids[bids.length-1].total)
        }
    }, [asks, bids])

    useEffect(() => {
        if (asks[0] && bids[0]) {
            const percent = toPercent(spread/asks[0].price)
            setSpreadPercent(percent);
        }
    }, [asks, bids, spread])

    const togglePair = () => {
        if (pair === "PI_XBTUSD") subscribe("PI_ETHUSD")
        if (pair === "PI_ETHUSD") subscribe("PI_XBTUSD")
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
