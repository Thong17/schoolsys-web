import Container from 'components/shared/Container'
import ReportBreadcrumbs from './components/Breadcrumbs'
import useTheme from 'hooks/useTheme'
import { DetailSection } from 'components/shared/container/DetailSection'
import MilitaryTechRoundedIcon from '@mui/icons-material/MilitaryTechRounded'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import {
  getListGrade,
  getReportSchoolDashboard,
  selectListGrade,
  selectReportSchoolDashboard,
} from 'shared/redux'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import useLanguage from 'hooks/useLanguage'
import { CardContainer } from 'components/shared/container/CardContainer'
import { CircleIcon } from 'components/shared/table/CustomIcon'
import { CustomLineChart } from 'components/shared/charts/LineChart'
import { MiniSelectField } from 'components/shared/form'

const Header = () => {
  return (
    <>
      <ReportBreadcrumbs page='schoolReport' />
    </>
  )
}

const ListGrade = ({ grades, name, value = '', onChange }) => {
  return (
    <MiniSelectField
      search={true}
      name={name}
      value={value}
      options={grades}
      onChange={(event) => onChange(event)}
    />
  )
}

export const SchoolReport = () => {
  const { lang } = useLanguage()
  const { theme } = useTheme()
  const dispatch = useAppDispatch()
  const { data: dashboard } = useAppSelector(
    selectReportSchoolDashboard
  )
  const { data: listGrade } = useAppSelector(selectListGrade)
  const [gradeOption, setGradeOption] = useState<any[]>([])
  const [selectedGradeStudent, setSelectedGradeStudent] = useState('')
  const [selectedGradeClass, setSelectedGradeClass] = useState('')
  const [selectedGradeChart, setSelectedGradeChart] = useState('')
  const [queryParams, setQueryParams] = useSearchParams()

  const handleChangeGrande = (event) => {
    const { name, value } = event.target
    handleQuery({ [name]: value })
    switch (name) {
      case '_topStudent':
        setSelectedGradeStudent(value)
        break
      case '_topClass':
        setSelectedGradeClass(value)
        break
      default:
        setSelectedGradeChart(value)
        break
    }
  }

  const handleQuery = (data) => {
    let query = {}
    const _topStudent = queryParams.get('_topStudent')
    const _topClass = queryParams.get('_topClass')
    const _chartData = queryParams.get('_chartData')

    if (_topStudent) query = { _topStudent, ...query }
    if (_topClass) query = { _topClass, ...query }
    if (_chartData) query = { _chartData, ...query }

    setQueryParams({ ...query, ...data })
  }

  useEffect(() => {
    const options = listGrade?.map((grade) => ({
      value: grade._id,
      label: grade.name?.[lang] || grade.name?.['English'],
    }))
    setGradeOption(options)
  }, [listGrade, lang])

  useEffect(() => {
    dispatch(getListGrade())
  }, [dispatch])

  useEffect(() => {
    dispatch(getReportSchoolDashboard(queryParams))
  }, [dispatch, queryParams])

  return (
    <Container header={<Header />}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridColumnGap: 20,
          gridTemplateAreas: ` 
              'header header' 
              'charts charts'
            `,
        }}
      >
        <div
          style={{
            gridArea: 'header',
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            overflowX: 'auto',
            padding: 20,
          }}
        >
          <DetailSection
            title='Top Student'
            header={
              <div style={{ position: 'absolute', right: 0 }}>
                <ListGrade
                  value={selectedGradeStudent}
                  grades={gradeOption}
                  name='_topStudent'
                  onChange={handleChangeGrande}
                />
              </div>
            }
            data={
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 23 }}>
                  {dashboard?.topStudent?.name}
                </span>
                <span
                  style={{ fontSize: 13, color: theme.text.tertiary }}
                >{`${dashboard?.topStudent?.totalScore || 0} ${
                  dashboard?.topStudent?.totalScore > 1 ? 'Points' : 'Point'
                }`}</span>
              </div>
            }
            icon={
              <CircleIcon
                width={36.5}
                height={36.5}
                icon={dashboard?.topStudent?.profile}
                star={true}
              />
            }
          />
          <DetailSection
            title='Top Class'
            header={
              <div style={{ position: 'absolute', right: 0 }}>
                <ListGrade
                  value={selectedGradeClass}
                  grades={gradeOption}
                  name='_topClass'
                  onChange={handleChangeGrande}
                />
              </div>
            }
            data={
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 23 }}>
                  {dashboard?.topClass?.name?.[lang]}
                </span>
                <span
                  style={{ fontSize: 13, color: theme.text.tertiary }}
                >{`${dashboard?.topClass?.totalScore || 0} ${
                  dashboard?.topClass?.totalScore > 1 ? 'Points' : 'Point'
                }`}</span>
              </div>
            }
            icon={
              <MilitaryTechRoundedIcon
                style={{ fontSize: 40, color: '#FFD700' }}
              />
            }
          />
        </div>
        <CardContainer
          title={
            <>
              Charts
              <div style={{ position: 'absolute', right: 10, top: 7 }}>
                <ListGrade
                  value={selectedGradeChart}
                  grades={gradeOption}
                  name='_chartData'
                  onChange={handleChangeGrande}
                />
              </div>
            </>
          }
          style={{ gridArea: 'charts' }}
        >
          <CustomLineChart data={dashboard.chartData?.subjects} labels={dashboard.chartData?.students} height={370} />
        </CardContainer>
      </div>
    </Container>
  )
}
