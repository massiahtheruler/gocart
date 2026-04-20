import { createSlice } from '@reduxjs/toolkit'


const ratingSlice = createSlice({
    name: 'rating',
    initialState: {
        ratings: [],
    },
    reducers: {
        setRatings: (state, action) => {
            state.ratings = action.payload
        },
        upsertRating: (state, action) => {
            const existingIndex = state.ratings.findIndex(
                (rating) =>
                    rating.orderId === action.payload.orderId &&
                    rating.productId === action.payload.productId,
            )

            if (existingIndex >= 0) {
                state.ratings[existingIndex] = action.payload
            } else {
                state.ratings.push(action.payload)
            }
        },
    }
})

export const { setRatings, upsertRating } = ratingSlice.actions

export default ratingSlice.reducer
