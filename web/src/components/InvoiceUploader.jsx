import React, { useState } from 'react'
import api from '../api/api'
import Button from './Button'
import { FiUpload, FiFile, FiCheck } from 'react-icons/fi'

export default function InvoiceUploader({ onUploaded }){
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const token = localStorage.getItem('token')

  const submit = async (e) => {
    e.preventDefault();
    if(!file) return;
    setLoading(true)
    
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await api.post('/invoices/upload', fd, { 
        headers: { 
          Authorization: `Bearer ${token}`, 
          'Content-Type': 'multipart/form-data' 
        } 
      })
      onUploaded && onUploaded(res.data)
      setUploaded(true)
      setTimeout(() => {
        setFile(null)
        setUploaded(false)
      }, 3000)
    } catch (err) {
      alert('Erro ao fazer upload da fatura')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
        <input
          type="file"
          accept="application/pdf,image/*"
          onChange={e => setFile(e.target.files[0])}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="flex flex-col items-center gap-3">
            {file ? (
              <>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FiFile className="text-blue-600" size={32} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-600">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
              </>
            ) : (
              <>
                <div className="p-3 bg-gray-100 rounded-lg">
                  <FiUpload className="text-gray-600" size={32} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Clique para selecionar arquivo</p>
                  <p className="text-sm text-gray-600">PDF ou imagens (JPG, PNG)</p>
                </div>
              </>
            )}
          </div>
        </label>
      </div>
      
      {file && (
        <div className="flex gap-3">
          <Button
            type="button"
            variant="secondary"
            fullWidth
            onClick={() => setFile(null)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant={uploaded ? 'success' : 'primary'}
            fullWidth
            disabled={loading || uploaded}
          >
            {uploaded ? (
              <>
                <FiCheck size={18} />
                Processado!
              </>
            ) : loading ? (
              'Processando...'
            ) : (
              <>
                <FiUpload size={18} />
                Fazer Upload
              </>
            )}
          </Button>
        </div>
      )}
    </form>
  )
}
