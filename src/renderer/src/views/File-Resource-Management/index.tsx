import { usePageState } from './hook'
import { FileTree } from './modules/file-tree'
import { FileInfo } from './modules/file-info/file-info'
import { Header } from './modules/header/header'
import './index.less'
import { FileReview } from './modules/review/review'

export default function FileResourceManagement() {
  const { pageState, loadings, handlePage } = usePageState()
  const cmm = {
    loadings,
    pageState,
    handlePage,
  }
  return (
    <div className="file-resource-management">
      <Header {...cmm} />
      <div className="file-resource-management__container">
        <div className="file-tree-container">
          <FileTree {...cmm} path={pageState?.selectDrive || ''} />
        </div>
        <FileReview {...cmm} />
        <FileInfo {...cmm} />
      </div>
    </div>
  )
}
