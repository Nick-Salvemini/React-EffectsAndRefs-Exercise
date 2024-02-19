import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const API_BASE_URL = 'https://deckofcardsapi.com/api/deck'

function Deck() {
    const [deck, setDeck] = useState();
    const [card, setCard] = useState(null);
    const [autoDraw, setAutoDraw] = useState(false)
    const timerRef = useRef(null)

    useEffect(() => {
        async function fetchDeckId() {
            const res = await axios.get(
                `${API_BASE_URL}/new/shuffle/`);
            setDeck(res.data.deck_id)
        }

        fetchDeckId();
    }, [])

    useEffect(() => {
        const fetchCard = async () => {
            try {
                const res = await axios.get(
                    `${API_BASE_URL}/${deck}/draw/`
                );
                console.log("Remaining cards:", res.data.remaining);
                if (res.data.remaining === 0) {
                    setAutoDraw(false);
                    throw new Error('No Cards Remaining')
                }

                setCard(res.data.cards[0])

            } catch (error) {
                alert(error);
            }
        }

        if (autoDraw && !timerRef.current) {
            timerRef.current = setInterval(async () => {
                await fetchCard();
            }, 1000)
        }

        return () => {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, [autoDraw, setAutoDraw, deck])

    const toggleAutoDraw = () => {
        setAutoDraw(auto => !auto)
    }

    return (
        <>
            {deck ? (
                <button onClick={toggleAutoDraw}>{autoDraw ? "Stop" : "Keep"} Drawing
                </button>
            ) : null}
            <div>
                {card && (
                    <div>
                        <img src={card.image} alt={`${card.value} of ${card.suit}`} />
                    </div>
                )}
            </div>
        </>
    )
}
export default Deck;