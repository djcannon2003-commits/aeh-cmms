import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import './App.css'

function App() {
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const [assetNumber, setAssetNumber] = useState('')
  const [assetName, setAssetName] = useState('')
  const [assetType, setAssetType] = useState('')
  const [status, setStatus] = useState('')
  const [location, setLocation] = useState('')
  const [parentAssetId, setParentAssetId] = useState('')

  const [editingId, setEditingId] = useState(null)
  const [editAssetNumber, setEditAssetNumber] = useState('')
  const [editAssetName, setEditAssetName] = useState('')
  const [editAssetType, setEditAssetType] = useState('')
  const [editStatus, setEditStatus] = useState('')
  const [editLocation, setEditLocation] = useState('')
  const [editParentAssetId, setEditParentAssetId] = useState('')

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

  function getAssetLabel(id) {
    const parent = assets.find((a) => a.id === id)
    return parent ? `${parent.asset_number} - ${parent.asset_name}` : ''
  }

  async function addAsset() {
    if (!assetNumber || !assetName) {
      alert('Asset Number and Name are required')
      return
    }

    const { error } = await supabase.from('Assets').insert([
      {
        company_id: '88e43d03-eb97-4b56-a75d-f5d081896f4e',
        site_id: '49e72850-1b70-4f8d-9ecd-c523a2e017aa',
        parent_asset_id: parentAssetId || null,
        asset_number: assetNumber,
        asset_name: assetName,
        asset_type: assetType,
        asset_status: status,
        location: location
      }
    ])

    if (error) {
      alert(error.message)
      return
    }

    setAssetNumber('')
    setAssetName('')
    setAssetType('')
    setStatus('')
    setLocation('')
    setParentAssetId('')
    fetchAssets()
  }

  function startEdit(asset) {
    setEditingId(asset.id)
    setEditAssetNumber(asset.asset_number || '')
    setEditAssetName(asset.asset_name || '')
    setEditAssetType(asset.asset_type || '')
    setEditStatus(asset.asset_status || '')
    setEditLocation(asset.location || '')
    setEditParentAssetId(asset.parent_asset_id || '')
  }

  function cancelEdit() {
    setEditingId(null)
  }

  async function saveEdit(id) {
    if (!editAssetNumber || !editAssetName) {
      alert('Asset Number and Name are required')
      return
    }

    if (editParentAssetId === id) {
      alert('An asset cannot be its own parent')
      return
    }

    const { error } = await supabase
      .from('Assets')
      .update({
        parent_asset_id: editParentAssetId || null,
        asset_number: editAssetNumber,
        asset_name: editAssetName,
        asset_type: editAssetType,
        asset_status: editStatus,
        location: editLocation
      })
      .eq('id', id)

    if (error) {
      alert(error.message)
      return
    }

    setEditingId(null)
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

  const filteredAssets = assets.filter((a) =>
    (a.asset_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (a.asset_number || '').toLowerCase().includes(search.toLowerCase()) ||
    (a.asset_type || '').toLowerCase().includes(search.toLowerCase()) ||
    (a.location || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page">
      <h1>AEH CMMS</h1>
      <h2>Assets</h2>

      <div className="form">
        <input placeholder="Asset Number" value={assetNumber} onChange={(e) => setAssetNumber(e.target.value)} />
        <input placeholder="Asset Name" value={assetName} onChange={(e) => setAssetName(e.target.value)} />
        <input placeholder="Type" value={assetType} onChange={(e) => setAssetType(e.target.value)} />

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Select Status</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
          <option value="SPARE">SPARE</option>
        </select>

        <input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />

        <select value={parentAssetId} onChange={(e) => setParentAssetId(e.target.value)}>
          <option value="">No Parent Asset</option>
          {assets.map((asset) => (
            <option key={asset.id} value={asset.id}>
              {asset.asset_number} - {asset.asset_name}
            </option>
          ))}
        </select>

        <button onClick={addAsset} disabled={editingId !== null}>
          Add Asset
        </button>
      </div>

      <input
        placeholder="Search assets..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Asset Number</th>
              <th>Name</th>
              <th>Type</th>
              <th>Status</th>
              <th>Location</th>
              <th>Parent Asset</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredAssets.map((asset) => (
              <tr key={asset.id}>
                {editingId === asset.id ? (
                  <>
                    <td><input value={editAssetNumber} onChange={(e) => setEditAssetNumber(e.target.value)} /></td>
                    <td><input value={editAssetName} onChange={(e) => setEditAssetName(e.target.value)} /></td>
                    <td><input value={editAssetType} onChange={(e) => setEditAssetType(e.target.value)} /></td>
                    <td>
                      <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
                        <option value="">Select Status</option>
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="INACTIVE">INACTIVE</option>
                        <option value="SPARE">SPARE</option>
                      </select>
                    </td>
                    <td><input value={editLocation} onChange={(e) => setEditLocation(e.target.value)} /></td>
                    <td>
                      <select value={editParentAssetId} onChange={(e) => setEditParentAssetId(e.target.value)}>
                        <option value="">No Parent Asset</option>
                        {assets
                          .filter((parent) => parent.id !== asset.id)
                          .map((parent) => (
                            <option key={parent.id} value={parent.id}>
                              {parent.asset_number} - {parent.asset_name}
                            </option>
                          ))}
                      </select>
                    </td>
                    <td>
                      <button onClick={() => saveEdit(asset.id)}>Save</button>
                      <button onClick={cancelEdit}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{asset.asset_number}</td>
                    <td>{asset.asset_name}</td>
                    <td>{asset.asset_type}</td>
                    <td>{asset.asset_status}</td>
                    <td>{asset.location}</td>
                    <td>{asset.parent_asset_id ? getAssetLabel(asset.parent_asset_id) : 'None'}</td>
                    <td>
                      <button onClick={() => startEdit(asset)}>Edit</button>
                      <button onClick={() => deleteAsset(asset.id)}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default App