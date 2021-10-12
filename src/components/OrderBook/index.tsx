import { useState, useEffect } from "react"
import { toPercent } from "../../helpers/helpers"
import { useSubscribeOrderWorker }  from "../../hooks/useSubscribeOrderWorker"
import { Pair } from "../../types/orderBookTypes"
import { OrderBookTable } from "../OrderBookTable"
import styles from "./styles.module.css"

export const OrderBook = () => {

    
    /*
     * NOTE: The pair should belong to global state. 
     * Other aspects of the trading interface like charts,
     * will also depend on the pair.
     * 
     * NOTE: Although url is specific to the orderbook, 
     * it should probably be stored in an env variable, 
     * possibly passed in as prop to the Orderbook.
     */
    const [ pair, setPair ] = useState<Pair>("PI_XBTUSD")
    const url = "wss://www.cryptofacilities.com/ws/v1"
    const { asks, bids, openSocket, closeSocket, subscribe } = useSubscribeOrderWorker(url, pair)
    
    const haveAsks: boolean = Boolean(asks.length > 0)
    const haveBids: boolean = Boolean(bids.length > 0)
    const totalAsks: number = haveAsks ? asks[asks.length-1].total : 0
    const totalBids: number = haveBids ? bids[bids.length-1].total : 0
    const spread: number = (haveAsks && haveBids) ? asks?.[0].price - bids[0].price : 0
    const spreadPercent: string = spread ? toPercent(spread/asks[0].price) : ''

    useEffect(() => {
        const handleWindowLoseFocus = () => {
            if(document.visibilityState==="hidden"){
                console.log("Tab lost visibility. Socket closed.")
                closeSocket()
            }
            else{
                console.log("Tab now visible. Socket opened")
                openSocket(url, pair)
            }
        } 
        document.addEventListener("visibilitychange", handleWindowLoseFocus)

        return () => {               
            document.removeEventListener("blur", handleWindowLoseFocus);
        }
    }, [])
    
    const togglePair = () => {
        let newPair: Pair = (pair === "PI_XBTUSD") ? "PI_ETHUSD" : "PI_XBTUSD"
        setPair(newPair)
        subscribe(newPair)
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
