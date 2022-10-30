import { Layout } from 'components/layouts/Layout'
import Container from 'components/shared/Container'
import { DetailTag } from 'components/shared/DetailTag'
import Axios from 'constants/functions/Axios'
import useLanguage from 'hooks/useLanguage'
import useNotify from 'hooks/useNotify'
import useTheme from 'hooks/useTheme'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { capitalizeText } from 'utils/index'

export const UserProfile = () => {
  const { id } = useParams()
  const { theme } = useTheme()
  const { notify } = useNotify()
  const [detail, setDetail] = useState<any>(null)
  const { lang } = useLanguage()

  console.log(detail)

  useEffect(() => {
    if (!id) return

    Axios({
      method: 'GET',
      url: `/user/detail/${id}`,
    })
      .then((data) => {
        setDetail(data?.data?.data)
      })
      .catch((err) => notify(err?.response?.data?.message, 'error'))
    // eslint-disable-next-line
  }, [id])

  const renderUserSegment = (segment) => {
    switch (segment) {
      case 'Student':
        return <>
          <DetailTag
            label='FullName'
            value={`${detail?.profile?.lastName} ${detail?.profile?.firstName}`}
          />
          <DetailTag label='ID' value={detail?.profile?.ref} />
          <DetailTag
            label='Class'
            value={
              detail?.profile?.currentAcademy?.class?.name?.[lang] ||
              detail?.profile?.currentAcademy?.class?.name?.['English']
            }
          />
          <DetailTag label='Schedule' value={capitalizeText(detail?.profile?.currentAcademy?.class?.schedule)} />
        </>

      case 'Teacher':
        return <>
          <DetailTag
            label='FullName'
            value={`${detail?.profile?.lastName} ${detail?.profile?.firstName}`}
          />
          <DetailTag label='ID' value={detail?.profile?.ref} />
          <DetailTag
            label='Class'
            value={
              detail?.profile?.currentAcademy?.class?.name?.[lang] ||
              detail?.profile?.currentAcademy?.class?.name?.['English']
            }
          />
          <DetailTag label='Schedule' value={capitalizeText(detail?.profile?.currentAcademy?.class?.schedule)} />
        </>
    
      default:
        break
    }
  }

  return (
    <Layout>
      <Container>
        <div
          style={{
            backgroundColor: theme.background.secondary,
            padding: 15,
            borderRadius: theme.radius.ternary,
            display: 'flex',
            justifyContent: 'space-around',
          }}
        >
          <DetailTag label='Username' value={detail?.user?.username} />
          <DetailTag label='Segment' value={detail?.user?.segment} />
          {renderUserSegment(detail?.user?.segment)}
        </div>
        {detail?.profile && <div style={{ padding: 15, borderRadius: theme.radius.ternary }}>
          
        </div>}
      </Container>
    </Layout>
  )
}
