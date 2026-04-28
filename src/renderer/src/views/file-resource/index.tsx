import { FileTree } from './modules/file-tree'
import { FileInfo } from './modules/file-info/file-info'
import { Header } from './modules/header/header'
import Review from './modules/review/review'
import Setting from './modules/setting/setting'
import './index.less'
import { DiagonalLoading } from '@/components'
import { useFRMStore } from './store'
import { useEffect } from 'react'
import { useLoadings } from '@/util'

export default function FileResourceManagement() {
  const frm = useFRMStore()
  const [loadings, setLoadings] = useLoadings()

  const cmm = {
    loadings,
    setLoadings,
  }

  useEffect(() => {
    !frm.initSuccess && frm.init()
  }, [frm.initSuccess])

  return (
    <div className="file-resource-management">
      <Header {...cmm} />
      <div className="file-resource-management__container">
        {frm.drives?.length ? (
          <>
            <div className="file-tree-container">
              <FileTree frm={frm} path={frm?.selectDrive || ''} />
            </div>
            <Review />
            <FileInfo />
            <Setting />
          </>
        ) : (
          <DiagonalLoading />
        )}
      </div>
    </div>
  )
}
