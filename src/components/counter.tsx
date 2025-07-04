'use client';


import { decrement, increment, incrementByAmount, incrementAsync } from "@components/lib/counter/counterSlice";
import { AppDispatch, RootState } from "@components/lib/store";
import { useDispatch, useSelector } from "react-redux"

const Counter = () => {
    const count = useSelector((state: RootState) => state.counter.value);
    const dispatch = useDispatch<AppDispatch>();

    return (
        <div>
            <h2>{count}</h2>
            <div>
                <button onClick={() => dispatch(incrementAsync(10))}>increment</button>
                <button onClick={() => dispatch(decrement())}>decrement</button>
            </div>
        </div>
    )
}


export default Counter;