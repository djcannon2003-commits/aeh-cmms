import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import './App.css'

function App() {
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAssets()
  }, [])

  async function fetchAssets() {
    const { data, error } = await supabase
      .from('Assets')
      .select('*')
      .order('asset_number')

    if (!error) setAssets(data || [])
    setLoading(false)
  }

  return (
    <div className="app">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>AEH CMMS</h2>
        <ul>
          <li className="active">Assets</li>
          <li>Work Orders</li>
          <li>Inventory</li>
          <li>PMs</li>
          <li>Reports</li>
        </ul>
      </div>

      {/* MAIN */}
      <div className="main">

        {/* HEADER */}
        <div className="header">
          <h1>Assets</h1>
          <button className="primary">+ Add Asset</button>
        </div>

        {/* CONTENT */}
        <div className="card">

          {loading ? (
            <p>Loading...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Asset #</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Location</th>
                </tr>
              </thead>

              <tbody>
                {assets.map(asset => (
                  <tr key={asset.id}>
                    <td>{asset.asset_number}</td>
                    <td>{asset.asset_name}</td>
                    <td>{asset.asset_type}</td>
                    <td>
                      <span className={`status ${asset.asset_status}`}>
                        {asset.asset_status}
                      </span>
                    </td>
                    <td>{asset.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

        </div>

      </div>

    </div>
  )
}

export default App