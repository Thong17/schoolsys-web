import { AlertDialog } from 'components/shared/table/AlertDialog'
import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import useTheme from 'hooks/useTheme'
import { FlexBetween } from 'components/shared/container/FlexBetween'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import {
  getListStudentOfClass,
  getListSubjectOfClass,
  selectListStudentOfClass,
  selectListSubjectOfClass,
} from './redux'
import { useEffect, useState } from 'react'
import useLanguage from 'hooks/useLanguage'
import { StudentScore } from './components/StudentScore'
import { TextHighlight } from 'components/shared/TextHighlight'

export const ScoreDialog = ({
  gradeId,
  classId,
  dialog,
  setDialog,
  rowData,
}: any) => {
  const { theme } = useTheme()
  const { lang } = useLanguage()
  const dispatch = useAppDispatch()
  const { data: listStudent } = useAppSelector(selectListStudentOfClass)
  const { data: listSubject } = useAppSelector(selectListSubjectOfClass)

  const [studentLoading, setStudentLoading] = useState(true)
  const [subjectLoading, setSubjectLoading] = useState(true)

  const [students, setStudents] = useState<any>([])
  const [subjects, setSubjects] = useState<any>([])
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [currentSubject, setCurrentSubject] = useState<any>(null)

  useEffect(() => {
    const [current] = subjects.filter((subject) => subject._id === selectedSubject)
    setCurrentSubject(current)
  }, [selectedSubject, subjects])

  useEffect(() => {
    if (!gradeId || !classId) return
    dispatch(getListStudentOfClass({ id: classId }))
    dispatch(getListSubjectOfClass({ id: gradeId }))
  }, [gradeId, classId, dispatch])

  useEffect(() => {
    setStudents(listStudent)
    setStudentLoading(false)
  }, [listStudent])

  useEffect(() => {
    setSubjects(listSubject)
    setSubjectLoading(false)
    setSelectedSubject(listSubject?.[0]?._id)
  }, [listSubject])

  const handleClickSubject = (id) => {
    setSelectedSubject(id)
  }

  const handleCloseDialog = () => {
    setDialog({ ...dialog, open: false })
  }

  return (
    <AlertDialog isOpen={dialog.open} handleClose={handleCloseDialog}>
      <div
        style={{
          padding: '20px 30px 10px 30px',
          fontFamily: theme.font.family,
        }}
      >
        <FlexBetween>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'start',
            }}
          >
            <h2 style={{ color: theme.text.secondary, marginRight: 20 }}>
              Subject
            </h2>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'start',
                overflowX: 'auto',
              }}
            >
              {!subjectLoading &&
                subjects?.map((subject, key) => {
                  return (
                    <Button
                      key={key}
                      style={{
                        color: theme.text.secondary,
                        backgroundColor:
                          selectedSubject === subject._id
                            ? theme.background.secondary
                            : theme.background.primary,
                        transform:
                          selectedSubject === subject._id
                            ? 'scale(1)'
                            : 'scale(0.8)',
                        transition: '0.2s ease',
                        margin: '0 3px',
                        padding: '0 10px',
                        height: 33,
                        borderRadius: theme.radius.secondary,
                      }}
                      onClick={() => handleClickSubject(subject._id)}
                    >
                      {subject.name?.[lang] || subject.name?.['English']}
                    </Button>
                  )
                })}
            </div>
          </div>
          <div style={{ display: 'flex' }}>
            <TextHighlight text={`Pass Score: ${currentSubject?.passScore || 0}`} color={theme.text.secondary} />
            <div style={{ width: 10 }}></div>
            <TextHighlight text={`Full Score: ${currentSubject?.fullScore || 0}`} color={theme.text.secondary} />
          </div>
        </FlexBetween>
      </div>
      <div style={{ width: '95vw', height: '75vh' }}>
        {!studentLoading && (
          <StudentScore
            students={students}
            subject={selectedSubject}
            classId={classId}
          />
        )}
      </div>
      <DialogActions style={{ position: 'absolute', bottom: 5, right: 10 }}>
        <Button onClick={handleCloseDialog} variant='contained'>
          Close
        </Button>
      </DialogActions>
    </AlertDialog>
  )
}
