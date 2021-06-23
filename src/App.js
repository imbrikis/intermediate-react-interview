import React, { useEffect, useState } from 'react'
import './styles.css'

export default function App() {
  const url = 'https://randomuser.me/api/?results=20'
  const [immutableData, setImmutableData] = useState([])
  const [data, setData] = useState([])
  const [sortMethod, setSortMethod] = useState({ filter: '', sortAsc: true })

  const getData = () => {
    return fetch(url)
      .then((result) => result.json())
      .then(({ results }) => {
        let arr = []
        // flattening the data
        results.forEach((d) => {
          arr.push({
            city: d.location?.city,
            latitude: d.location?.coordinates?.latitude,
            longitude: d.location?.coordinates?.longitude,
            country: d.location?.country,
            postcode: d.location?.postcode,
            state: d.location?.state,
            number: d.location?.street?.number,
            name: d.location?.street?.name,
          })
        })

        setImmutableData(arr)
        setData(arr)
      })
  }

  useEffect(() => {
    getData()
  }, [])

  let renderedData = data.map((d) => {
    return (
      <tr key={d.login?.uuid}>
        <td>{d.city}</td>
        <td>{d.latitude}</td>
        <td>{d.longitude}</td>
        <td>{d.country}</td>
        <td>{d.postcode}</td>
        <td>{d.state}</td>
        <td>{d.number}</td>
        <td>{d.name}</td>
      </tr>
    )
  })

  const sortColumn = (col) => {
    // sort using the Array .sort method
    const dataCopy = data

    // toggles the sort direction if the same column is clicked repeatedly
    if (sortMethod.filter === col) {
      if (sortMethod.sortAsc === true) {
        dataCopy.sort((a, b) => {
          if (a[col] < b[col]) return -1
          if (a[col] > b[col]) return 1
          return 0
        })
      } else {
        dataCopy.sort((a, b) => {
          if (a[col] < b[col]) return 1
          if (a[col] > b[col]) return -1
          return 0
        })
      }

      setSortMethod({ filter: col, sortAsc: !sortMethod.sortAsc })
      return
    }

    dataCopy.sort((a, b) => {
      if (a[col] < b[col]) return -1
      if (a[col] > b[col]) return 1
      return 0
    })

    setData([...dataCopy])
    setSortMethod({ filter: col, sortAsc: false })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const searchTerm = e.target[0].value

    const dataCopy = immutableData
    const result = dataCopy.filter((item) => {
      for (let i in item) {
        if (item[i].toString().toLowerCase().includes(searchTerm)) return true
      }
    })

    setData([...result])
  }

  return (
    <div>
      <form onSubmit={(e) => handleSubmit(e)} className='input'>
        <input type='text' />
        <button type='submit'>Search</button>
      </form>
      <table>
        <thead>
          <tr>
            <th onClick={() => sortColumn('city')}>City</th>
            <th onClick={() => sortColumn('latitude')}>Latitude</th>
            <th onClick={() => sortColumn('longitude')}>Longitude</th>
            <th onClick={() => sortColumn('country')}>Country</th>
            <th onClick={() => sortColumn('postcode')}>Postcode</th>
            <th onClick={() => sortColumn('state')}>State</th>
            <th onClick={() => sortColumn('number')}>Street Number</th>
            <th onClick={() => sortColumn('name')}>Streen Name</th>
          </tr>
        </thead>
        <tbody>{renderedData}</tbody>
      </table>
    </div>
  )
}
