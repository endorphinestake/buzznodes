import { Dispatch } from '@reduxjs/toolkit'

export interface IDateRange {
    dateFrom: Date
    dateTo: Date
}

export interface IRedux {
    getState: any
    dispatch: Dispatch<any>
    rejectWithValue: any
}
