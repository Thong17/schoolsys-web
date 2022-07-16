import { AlertDialog } from 'components/shared/table/AlertDialog'
import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import useTheme from 'hooks/useTheme'
import { FlexBetween } from 'components/shared/container/FlexBetween'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { getListStudentOfClass, getListSubjectOfClass, selectListStudentOfClass, selectListSubjectOfClass } from './redux'
import { useEffect, useState } from 'react'
import useLanguage from 'hooks/useLanguage'
import { StudentScore } from './components/StudentScore'

export const ScoreDialog = ({ classId, dialog, setDialog, rowData }: any) => {
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

  useEffect(() => {
    if (!classId) return
    dispatch(getListStudentOfClass({ id: classId }))
    dispatch(getListSubjectOfClass({ id: classId }))
  }, [classId, dispatch])

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
      <div style={{ padding: '20px 30px 10px 30px', fontFamily: theme.font.family }}>
        <FlexBetween>
          <h2 style={{ color: theme.text.secondary }}>Score List</h2>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'start',
            }}
          >
            {
              !subjectLoading && subjects?.map((subject, key) => {
                return <Button
                  key={key}
                  style={{
                    color: theme.text.secondary,
                    backgroundColor: selectedSubject === subject._id ? theme.background.secondary : theme.background.primary,
                    margin: '0 3px',
                    padding: '3px 10px',
                    borderRadius: theme.radius.quaternary
                  }}
                  onClick={() => handleClickSubject(subject._id)}
                >
                  {subject.name?.[lang] || subject.name?.['English']}
                </Button>
              })
            }
          </div>
        </FlexBetween>
      </div>
      <div style={{ width: '95vw', height: '75vh' }}>
        {
          !studentLoading && <StudentScore students={students} subject={selectedSubject} classId={classId} />
        }
      </div>
      <DialogActions style={{ position: 'absolute', bottom: 5, right: 10 }}>
        <Button onClick={handleCloseDialog} variant='contained'>
          Close
        </Button>
      </DialogActions>
    </AlertDialog>
  )
}
