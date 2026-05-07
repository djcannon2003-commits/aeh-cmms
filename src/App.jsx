import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import './App.css'

const COMPANY_ID = '88e43d03-eb97-4b56-a75d-f5d081896f4e'
const SITE_ID = '49e72850-1b70-4f8d-9ecd-c523a2e017aa'

function App() {
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)

  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingAsset, setEditingAsset] = useState(null)

  const [assetNumber, setAssetNumber] = useState('')
  const [assetName, setAssetName] = useState('')
  const [assetType, setAssetType] = useState('')
  const [assetStatus, setAssetStatus] = useState('ACTIVE')
  const [assetLocation, setAssetLocation] = useState('')
  const [parentAssetId, setParentAssetId] = useState('')

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

  function resetForm() {
    setAssetNumber('')
    setAssetName('')
    setAssetType('')
    setAssetStatus('ACTIVE')
    setAssetLocation('')
    setParentAssetId('')
    setEditingAsset(null)
  }

  function getAssetLabel(id) {
    const asset = assets.find((a) => a.id === id)
    return asset ? `${asset.asset_number} - ${asset.asset_name}` : 'None'
  }

  function openAddModal() {
    resetForm()
    setShowAddModal(true)
  }

  function openEditModal(asset) {
    setEditingAsset(asset)
    setAssetNumber(asset.asset_number || '')
    setAssetName(asset.asset_name || '')
    setAssetType(asset.asset_type || '')
    setAssetStatus(asset.asset_status || 'ACTIVE')
    setAssetLocation(asset.location || '')
    setParentAssetId(asset.parent_asset_id || '')
    setShowEditModal(true)
  }

  async function handleAddAsset() {
    if (!assetNumber || !assetName) {
      alert('Asset Number and Asset Name are required')
      return
    }

    const { error } = await supabase.from('Assets').insert([
      {
        company_id: COMPANY_ID,
        site_id: SITE_ID,
        parent_asset_id: parentAssetId || null,
        asset_number: assetNumber,
        asset_name: assetName,
        asset_type: assetType,
        asset_status: assetStatus,
        location: assetLocation
      }
    ])

    if (error) {
      alert(error.message)
      return
    }

    setShowAddModal(false)
    resetForm()
    fetchAssets()
  }

  async function handleEditAsset() {
    if (!editingAsset) return

    if (!assetNumber || !assetName) {
      alert('Asset Number and Asset Name are required')
      return
    }

    if (parentAssetId === editingAsset.id) {
      alert('An asset cannot be its own parent')
      return
    }

    const { error } = await supabase
      .from('Assets')
      .update({
        parent_asset_id: parentAssetId || null,
        asset_number: assetNumber,
        asset_name: assetName,
        asset_type: assetType,
        asset_status: assetStatus,
        location: assetLocation
      })
      .eq('id', editingAsset.id)

    if (error) {
      alert(error.message)
      return
    }

    setShowEditModal(false)
    resetForm()
    fetchAssets()
  }

  async function deleteAsset(id) {
    const { error } = await supabase
      .from('Assets')
      .delete()
      .eq('id', id)

    if (error) {
      alert(error.message)
      return
    }

    fetchAssets()
  }

  function closeModals() {
    setShowAddModal(false)
    setShowEditModal(false)
    resetForm()
  }

  function AssetModal({ mode }) {
    const isEdit = mode === 'edit'

    return (
      <div className="modal-backdrop">
        <div className="modal-card">
          <div className="modal-header">
            <h2>{isEdit ? 'Edit Asset' : 'Add Asset'}</h2>
            <p>{isEdit ? 'Update equipment or asset record' : 'Create a new equipment or asset record'}</p>
          </div>

          <div className="form-row">
            <label>Asset Number</label>
            <input value={assetNumber} onChange={(e) => setAssetNumber(e.target.value)} placeholder="CV-001" />
          </div>

          <div className="form-row">
            <label>Asset Name</label>
            <input value={assetName} onChange={(e) => setAssetName(e.target.value)} placeholder="Infeed Conveyor" />
          </div>

          <div className="form-row">
            <label>Asset Type</label>
            <input value={assetType} onChange={(e) => setAssetType(e.target.value)} placeholder="Conveyor" />
          </div>

          <div className="form-row">
            <label>Status</label>
            <select value={assetStatus} onChange={(e) => setAssetStatus(e.target.value)}>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="SPARE">SPARE</option>
            </select>
          </div>

          <div className="form-row">
            <label>Location</label>
            <input value={assetLocation} onChange={(e) => setAssetLocation(e.target.value)} placeholder="Line 1" />
          </div>

          <div className="form-row">
            <label>Parent Asset</label>
            <select value={parentAssetId} onChange={(e) => setParentAssetId(e.target.value)}>
              <option value="">No Parent Asset</option>
              {assets
                .filter((asset) => !isEdit || asset.id !== editingAsset?.id)
                .map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.asset_number} - {asset.asset_name}
                  </option>
                ))}
            </select>
          </div>

          <div className="modal-actions">
            <button className="secondary-btn" onClick={closeModals}>
              Cancel
            </button>

            <button className="primary-btn" onClick={isEdit ? handleEditAsset : handleAddAsset}>
              {isEdit ? 'Save Changes' : 'Save Asset'}
            </button>
          </div>
        </div>
      </div>
    )
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

          <button className="primary-btn" onClick={openAddModal}>
            + Add Asset
          </button>
        </header>

        <section className="content-card">
          {loading ? (
            <p>Loading assets...</p>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
              <thead>
                <tr>
                  <th>Asset #</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th>Parent Asset</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {assets.map((asset) => (
                  <tr key={asset.id}>
                    <td>{asset.asset_number}</td>
                    <td>{asset.asset_name}</td>
                    <td>{asset.asset_type}</td>
                    <td>
                      <td>
                        <button onClick={() => startEdit(asset)}>Edit</button>
                        <button onClick={() => deleteAsset(asset.id)}>Delete</button>
                      </td>
                      <span className={`status-badge ${asset.asset_status}`}>
                        {asset.asset_status}
                      </span>
                    </td>
                    <td>{asset.location}</td>
                    <td>{asset.parent_asset_id ? getAssetLabel(asset.parent_asset_id) : 'None'}</td>
                    <td>
                      <button className="small-btn" onClick={() => openEditModal(asset)}>
                        Edit
                      </button>
                      <button className="small-danger-btn" onClick={() => deleteAsset(asset.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {showAddModal && <AssetModal mode="add" />}
      {showEditModal && <AssetModal mode="edit" />}
    </div>
  )
}

export default App