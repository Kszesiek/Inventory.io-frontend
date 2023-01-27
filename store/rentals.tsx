import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface Rental {
  statusId?: number,
  rentalId: number;
  userId: string,
  name: string,
  description: string,
  startDate: string;
  endDate: string;
}

export interface RentalTemplate {
  status_id?: number,
  name: string,
  description: string,
  borrower_id: string,
  start_time: string,
  end_time: string,
}

// export function isRental(object: any): object is Rental {
//   return (
//     object &&
//     typeof object === 'object' &&
//     typeof object['rentalId'] === 'number' &&
//     typeof object['userId'] === 'number' &&
//     typeof object['name'] === 'string' &&
//     typeof object['description'] === 'string' &&
//     typeof object['startDate'] === 'string' &&
//     typeof object['endDate'] === 'string'
//
//     // Array.isArray(object['items']) &&
//     // object['items'].every(item =>
//     //   typeof item === 'object' &&
//     //   typeof item['itemId'] === 'string' &&
//     //   typeof item['name'] === 'string'
//     // )
//   );
// }

export function rentalFromTemplate(rentalTemplate: RentalTemplate, rentalId?: number): Rental {
  return {
    userId: rentalTemplate.borrower_id,
    rentalId: rentalId || Math.random(),
    startDate: rentalTemplate.start_time,
    endDate: rentalTemplate.end_time,
    name: rentalTemplate.name,
    description: rentalTemplate.description,
  }
}

export const rentalsSlice = createSlice({
  name: 'rentals',
  initialState: {
    rentals: new Array<Rental>(),
    total: 0,
  },
  reducers: {
    addRental: (state, action: PayloadAction<Rental>) => {
      if (!state.rentals.some(item => item.rentalId === action.payload.rentalId)) {
        state.rentals.push(action.payload);
        state.total += 1;
      }
    },
    removeRental: (state, action: PayloadAction<number>) => {
      if (state.rentals.some(item => item.rentalId === action.payload)) {
        state.rentals = state.rentals.filter(item => item.rentalId !== action.payload);
        state.total -= 1;
      }
    },
    modifyRental: (state, action: PayloadAction<Rental>) => {
      const index = state.rentals.findIndex(item => item.rentalId === action.payload.rentalId);
      if (index >= 0) {
        state.rentals[index] = action.payload;
      }
    },
    loadRentals: (state, action: PayloadAction<Rental[]>) => {
      state.rentals = action.payload;
      state.total = action.payload.length;
    },
    loadRental: (state, action: PayloadAction<Rental>) => {
      const index = state.rentals.findIndex(rental => rental.rentalId === action.payload.rentalId);
      if (index >= 0)
        state.rentals[index] = action.payload;
      else
        state.rentals.push(action.payload);
    },
    wipeRentals: (state) => {
      state.rentals = [];
      state.total = 0;
    },
  },
});


export const rentalsActions = rentalsSlice.actions;
export default rentalsSlice.reducer;