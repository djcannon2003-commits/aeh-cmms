import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import './App.css'

const COMPANY_ID = '88e43d03-eb97-4b56-a75d-f5d081896f4e'
const SITE_ID = '49e72850-1b70-4f8d-9ecd-c523a2e017aa'

function App() {
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  const [newAssetNumber, setNewAssetNumber] = useState('')
  const [newAssetName, setNewAssetName] = useState('')
  const [newAssetType, setNewAssetType] = useState('')
  const [newStatus, setNewStatus] = useState('ACTIVE')
  const [newLocation, setNewLocation] = useState('')

  useEffect(() => {
    fetchAssets()
  }, [])

  async function fetchAssets() {
    const { data, error } = await supabase
      .from('Assets')
      .select('*')
      .order('asset_number')

    if (error) {
      alert(error.message)
      return
    }

    setAssets(data || [])
    setLoading(false)
  }

  async function handleAddAsset() {
    if (!newAssetNumber || !newAssetName) {
      alert('Asset Number and Asset Name are required')
      return
    }

    const { error } = await supabase.from('Assets').insert([
      {
        company_id: COMPANY_ID,
        site_id: SITE_ID,
        asset_number: newAssetNumber,
        asset_name: newAssetName,
        asset_type: newAssetType,
        asset_status: newStatus,
        location: newLocation
      }
    ])

    if (error) {
      alert(error.message)
      return
    }

    setNewAssetNumber('')
    setNewAssetName('')
    setNewAssetType('')
    setNewStatus('ACTIVE')
    setNewLocation('')
    setShowModal(false)
    fetchAssets()
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>AEH CMMS</h2>
        <nav>
          <button className="nav-active">Assets</button>
          <button>Work Orders</button>
          <button>Inventory</button>
          <button>PMs</button>
          <button>Reports</button>
        </nav>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <h1>Assets</h1>
            <p>Manage equipment, hierarchy, and asset records</p>
          </div>

          <button className="primary-btn" onClick={() => setShowModal(true)}>
            + Add Asset
          </button>
        </header>

        <section className="content-card">
          {loading ? (
            <p>Loading assets...</p>
          ) : (
            <table className="data-table">
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
                {assets.map((asset) => (
                  <tr key={asset.id}>
                    <td>{asset.asset_number}</td>
                    <td>{asset.asset_name}</td>
                    <td>{asset.asset_type}</td>
                    <td>
                      <span className={`status-badge ${asset.asset_status}`}>
                        {asset.asset_status}
                      </span>
                    </td>
                    <td>{asset.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>

      {showModal && (
  <div className="modal-backdrop">
    <div className="modal-card">

      <div className="modal-header">
        <h2>Add Asset</h2>
        <p>Create a new equipment or asset record</p>
      </div>

      <div className="form-row">
        <label>Asset Number</label>
        <input
          value={newAssetNumber}
          onChange={(e) => setNewAssetNumber(e.target.value)}
          placeholder="CV-001"
        />
      </div>

      <div className="form-row">
        <label>Asset Name</label>
        <input
          value={newAssetName}
          onChange={(e) => setNewAssetName(e.target.value)}
          placeholder="Infeed Conveyor"
        />
      </div>

      <div className="form-row">
        <label>Asset Type</label>
        <input
          value={newAssetType}
          onChange={(e) => setNewAssetType(e.target.value)}
          placeholder="Conveyor"
        />
      </div>

      <div className="form-row">
        <label>Status</label>
        <select
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
        >
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
          <option value="SPARE">SPARE</option>
        </select>
      </div>

      <div className="form-row">
        <label>Location</label>
        <input
          value={newLocation}
          onChange={(e) => setNewLocation(e.target.value)}
          placeholder="Line 1"
        />
      </div>

      <div className="modal-actions">
        <button
          className="secondary-btn"
          onClick={() => setShowModal(false)}
        >
          Cancel
        </button>

        <button
          className="primary-btn"
          onClick={handleAddAsset}
        >
          Save Asset
        </button>
      </div>

    </div>
  </div>
)}
    </div>
  )
}

export default App