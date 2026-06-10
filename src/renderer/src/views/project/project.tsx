import Dash_Project from '../dashboard/modules/project/project'
import ProjectOperation from '../dashboard/modules/project-operation/operation'
import { GitReview } from '../dashboard/modules/git-review/git-review'
import { ContentLayout } from '@/components/layout'

export default function Project() {
  return (
    <ContentLayout name='project'>
      <Dash_Project />
      <ProjectOperation />
      <GitReview />
    </ContentLayout>
  )
}
