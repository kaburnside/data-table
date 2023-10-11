import { faker } from '@faker-js/faker'
import { ColumnSort, SortingState } from '@tanstack/react-table'
import { UserData } from './features/data-table/types'

// export type UserData = {
//     id: number,
//     firstName: string,
//     lastName: string,
//     email: string,
//     city: string,
//     registeredDate: Date,
//     isPrivate: boolean
// }

export type UserDataApiResponse = {
    data: UserData[]
    meta: {
      totalRowCount: number
    }
  }

  const range = (len: number) => {
    const arr = []
    for (let i = 0; i < len; i++) {
      arr.push(i)
    }
    return arr
  }

  const newUser = (index: number): UserData => {
    return {
      id: index + 1,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      city: faker.location.city(),
      registeredDate: faker.date.recent(),
      isPrivate: faker.datatype.boolean(0.7)
    }
  }

  export function makeData(...lens: number[]) {
    const makeDataLevel = (depth = 0): UserData[] => {
      const len = lens[depth]!
      return range(len).map((d): UserData => {
        return {
          ...newUser(d),
        }
      })
    }
  
    return makeDataLevel()
  }
  
  const data = makeData(1000)
  
  //simulates a backend api
  export const fetchData = (
    start: number
  ) => {
    const dbData = [...data]
    return {
      data: dbData.slice(start, start * 100),
      meta: {
        totalRowCount: dbData.length,
      },
    }
  }