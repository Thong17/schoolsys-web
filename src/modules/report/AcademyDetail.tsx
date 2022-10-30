import { useAppDispatch, useAppSelector } from 'app/hooks'
import { AverageHighlight } from 'components/shared/AverageHighlight'
import Container from 'components/shared/Container'
import { DetailTag } from 'components/shared/DetailTag'
import { CircleIcon } from 'components/shared/table/CustomIcon'
import { ITableColumn, StickyTable } from 'components/shared/table/StickyTable'
import useLanguage from 'hooks/useLanguage'
import useTheme from 'hooks/useTheme'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getDetailAcademy, selectDetailAcademyDashboard } from 'shared/redux'
import { calculateAverageScore, calculateGraduateResult, calculateTotalScore, capitalizeText, dateFormat } from 'utils/index'
import ReportBreadcrumbs from './components/Breadcrumbs'

const Header = () => {
  return (
    <>
      <ReportBreadcrumbs page='academyDetail' />
    </>
  )
}



const studentColumnData: ITableColumn<any>[] = [
  { id: 'rank', label: 'Rank' },
  { id: 'ref', label: 'ID' },
  { id: 'profile', label: 'Profile' },
  { id: 'lastName', label: 'Last\u00a0Name' },
  { id: 'firstName', label: 'First\u00a0Name' },
  { id: 'gender', label: 'Gender' },
  { id: 'score', label: 'Score' },
  { id: 'average', label: 'Average' },
  { id: 'result', label: 'Grade' },
]

const createStudentData = (
  tags: string,
  monitor: string,
  id: string,
  ref: string,
  profile: string,
  lastName: string,
  firstName: string,
  gender: string,
  scores: Array<any>,
  subjects: Array<any>,
): any => {
  const calculatedAverage = calculateAverageScore(scores, subjects.length)



  const profileImage =
    id === monitor? (
      <CircleIcon star={true} icon={profile} />
    ) : (
      <CircleIcon icon={profile} />
    )
  let averageText = (
    <AverageHighlight
      calculatedAverage={calculatedAverage}
      subjects={subjects}
    />
  )

  return {
    tags,
    id,
    ref,
    profile: profileImage,
    lastName,
    firstName,
    gender: capitalizeText(gender),
    score: calculateTotalScore(scores),
    result: calculateGraduateResult(scores, subjects),
    average: averageText,
  }
}

export const AcademyDetail = () => {
  const { theme } = useTheme()
  const { lang } = useLanguage()
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const { data, status: statusClass } = useAppSelector(selectDetailAcademyDashboard)
  const [_class, setClass] = useState<any>(null)
  const [studentData, setStudentData] = useState([])

  useEffect(() => {
    if (statusClass !== 'SUCCESS') return

    const studentData = data?.students?.map((student) => {
      const tags = `${JSON.stringify(student.firstName)}${student.lastName}${student.gender}${student.ref}`.replace(/ /g,'')
      return createStudentData(
        tags,
        data.monitor?._id,
        student?.id,
        student?.ref,
        student?.profile?.filename,
        student?.lastName,
        student?.firstName,
        student?.gender,
        data?.scores?.filter(item => item.student === student.id),
        data?.subjects,
      )
    })
        
    setStudentData(studentData?.sort((a, b) => a.score > b.score ? -1 : 1).map((student, key) => { return { ...student, rank: `#${key+1}` } }))
    // eslint-disable-next-line
  }, [statusClass, _class])
  

  useEffect(() => {
    setClass(data)
  }, [data])

  useEffect(() => {
    if (!id) return
    dispatch(getDetailAcademy({ id }))
  }, [id, dispatch])

  return (
    <Container header={<Header />}>
      <div
        style={{
          backgroundColor: theme.background.secondary,
          padding: 15,
          borderRadius: theme.radius.ternary,
          display: 'flex',
          justifyContent: 'space-around',
          overflowX: 'auto',
          marginBottom: 20
        }}
      >
        <DetailTag
          value={_class?.name?.[lang] || _class?.name?.['English']}
          label='Class'
        />
        <DetailTag
          value={_class?.grade?.[lang] || _class?.grade?.['English']}
          label='Grade'
        />
        <DetailTag
          value={capitalizeText(_class?.schedule)}
          label='Schedule'
        />
        <DetailTag
          value={_class?.students?.length}
          label='Total Student'
        />
        <DetailTag
          value={_class?.subjects?.length}
          label='Total Subject'
        />
        <DetailTag
          value={dateFormat(_class?.endedAt)}
          label='Graduated'
        />
      </div>
      <StickyTable columns={studentColumnData} rows={studentData} pagination={false} />
    </Container>
  )
}
