import AddRoundedIcon from '@mui/icons-material/AddRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import Button from 'components/shared/Button'
import { MiniSelectField } from 'components/shared/form'
import useTheme from 'hooks/useTheme'
import { useEffect, useRef, useState } from 'react'
import Axios from 'constants/functions/Axios'
import { useAppDispatch } from 'app/hooks'
import useNotify from 'hooks/useNotify'
import { getClass, getListStudentOfClass } from '../redux'
import useAlert from 'hooks/useAlert'

const Score = ({ data, id, classId }) => {
  const { theme } = useTheme()
  const dispatch = useAppDispatch()
  const { notify } = useNotify()
  const confirm = useAlert()

  const handleRemoveScore = () => {
    confirm({
      title: 'Remove Score',
      description: 'Are you sure you want to remove this score?',
      variant: 'error'
    }).then(() => {
      Axios({
        method: 'DELETE',
        url: `/operation/score/delete/${id}`,
      })
        .then((data) => {
          dispatch(getClass({ id: classId, query: {}, fields: ['_id', 'name', 'room', 'schedule', 'grade', 'description', 'students'] }))
          dispatch(getListStudentOfClass({ id: classId }))
          notify(data?.data?.msg, 'success')
        })
        .catch((err) => notify(err?.response?.data?.msg, 'error'))
    }).catch()
  }

  return (
    <div
      style={{
        backgroundColor: `${theme.text.primary}11`,
        width: 'fit-content',
        paddingLeft: 5,
        borderRadius: 3,
        display: 'flex',
        alignItems: 'center',
        marginRight: 4,
        height: 30,
      }}
    >
      <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
        {data}
      </span>
      <Button
        onClick={handleRemoveScore}
        style={{
          minWidth: 20,
          marginLeft: 5,
          marginRight: 2,
          paddingRight: 5,
          paddingLeft: 5,
        }}
      >
        <CloseRoundedIcon style={{ fontSize: 15, color: theme.color.error }} />
      </Button>
    </div>
  )
}

const scoreOptions = [
  { label: '1st Semester', value: '1st Semester' },
  { label: '2nd Semester', value: '2nd Semester' },
  { label: 'Exam', value: 'Exam' },
  { label: 'Homework', value: 'Homework' },
  { label: 'Other', value: 'Other' },
]

export const ScoreForm = ({ defaultValue, onSubmit, student, academy, option, onChangeOption }: any) => {
  const { theme } = useTheme()
  const [selected, setSelected] = useState(option || 'other')
  const [score, setScore] = useState('')
  const scoreRef = useRef(document.createElement('input'))

  useEffect(() => {
    setSelected(option)
  }, [option])

  useEffect(() => {
    scoreRef.current.focus()
  }, [])

  const handleChangeType = (event) => {
    setSelected(event.target.value)
    return onChangeOption(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    return onSubmit({ description: selected, score, student, academy })
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        backgroundColor: `${theme.text.primary}11`,
        borderRadius: 3,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 10
      }}
    >
      <MiniSelectField
        value={selected}
        options={scoreOptions}
        onChange={handleChangeType}
      />
      <input
        ref={scoreRef}
        value={score}
        placeholder='Mark'
        type='number'
        maxLength={3}
        onChange={(event) => setScore(event.target.value)}
        style={{
          width: 37,
          padding: '2px 5px',
          outline: 'none',
          border: theme.border.quaternary,
          background: 'none',
          borderRadius: theme.radius.primary,
          color: theme.text.secondary,
        }}
      />
      <Button
        type='submit'
        style={{
          minWidth: 20,
          marginLeft: 5,
          marginRight: 2,
          paddingRight: 5,
          paddingLeft: 5,
        }}
      >
        <CheckRoundedIcon style={{ fontSize: 15, color: theme.color.success }} />
      </Button>
    </form>
  )
}

export const StudentMarkList = ({ scores, student, academy, subject, buttonRef, index, option, onChangeOption, classId }) => {
  const { theme } = useTheme()
  const [showForm, setShowForm] = useState(false)
  const [ref, setRef] = useState<any>(null)
  const dispatch = useAppDispatch()
  const { notify } = useNotify()

  const handleShowForm = () => {
    setShowForm(!showForm)
  }

  const handleSubmitScore = (data) => {
    Axios({
      method: 'POST',
      body: { ...data, subject },
      url: `/operation/score/create`,
    })
      .then((data) => {
        dispatch(getClass({ id: classId, query: {}, fields: ['_id', 'name', 'room', 'schedule', 'grade', 'description', 'students'] }))
        dispatch(getListStudentOfClass({ id: classId }))
        notify(data?.data?.msg, 'success')
        setShowForm(false)
        ref?.click()
      })
      .catch((err) => {
        if (err?.response?.status === 422) return notify(err?.response?.data?.[0]?.path, 'error')
        notify(err?.response?.data?.msg, 'error')
      })
  }

  useEffect(() => {
    setRef(buttonRef);
  }, [buttonRef])
  
  return (
    <div
      style={{
        position: 'relative',
        width: '70%',
        display: 'flex',
        alignItems: 'center',
        margin: '0 5px',
        borderRadius: theme.radius.primary,
        boxSizing: 'border-box',
        overflow: 'hidden',
        border: theme.border.quaternary,
        height: 37,
      }}
    >
      <span
        style={{
          backgroundColor: `${theme.text.primary}11`,
          height: 39,
          display: 'flex',
          alignItems: 'center',
          padding: '0 10px',
        }}
      >
        Mark
      </span>
      <Button
        ref={ref}
        id={index}
        style={{ height: 35, borderRadius: 0, minWidth: 50, position: 'absolute', right: 0 }}
        onClick={handleShowForm}
      >
        <AddRoundedIcon style={{ transform: showForm ? 'rotate(45deg)' : 'rotate(0)', transition: '0.2s ease', color: showForm ? theme.color.error : theme.color.info }} />
      </Button>
      <div
        style={{
          position: 'relative',
          width: '100%',
          display: 'flex',
          overflowX: 'auto',
          marginLeft: 4,
          marginRight: 50,
        }}
      >
        {scores?.map((score, key) => {
          return score.subject === subject && <Score key={key} data={`${score.description}: ${score.score}`} id={score._id} classId={classId} />
        })}
        {showForm && <ScoreForm student={student} academy={academy} onSubmit={handleSubmitScore} option={option} onChangeOption={onChangeOption} />}
      </div>
    </div>
  )
}
