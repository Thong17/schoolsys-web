import useTheme from 'hooks/useTheme'
import { calculateTotalScore, capitalizeText } from 'utils'
import { StudentMarkList } from './StudentMarkList'
import { TextLabel } from 'components/shared/TextLabel'
import { useRef, useState, useEffect } from 'react'
import { CircleIcon } from 'components/shared/table/CustomIcon'

const Column = ({ children, width, align }: any) => {
  return (
    <span
      style={{
        minWidth: width,
        display: 'inline-block',
        position: 'relative',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        textAlign: align || 'start',
        padding: '0 10px'
      }}
    >
      {children}
    </span>
  )
}

export const StudentScore = ({ students, subject, classId }) => {
  const { theme } = useTheme()
  const buttonRefs = useRef<any>([])
  buttonRefs.current = []
  const [option, setOption] = useState(new Date().getMonth().toString())
  const [refs, setRefs] = useState<any>([])

  const addButtonRef = (el) => {
    if (el && !buttonRefs.current.includes(el)) {
      buttonRefs.current.push(el)
    }
  }

  const handleChangeOption = (value) => {
    setOption(value)
  }

  useEffect(() => {
    setRefs(buttonRefs.current)
  }, [buttonRefs])
  
  return (
    <div>
      {students?.map((student, key) => {
        return (
          <div
            ref={addButtonRef}
            key={key}
            style={{
              padding: '7px',
              boxSizing: 'border-box',
              color: theme.text.secondary,
              fontFamily: theme.font.family,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: `${theme.background.secondary}`,
              boxShadow: theme.shadow.container,
              margin: 10,
              borderRadius: theme.radius.primary
            }}
          >
            <Column width={40}><CircleIcon icon={student.profile?.filename} /></Column>
            <Column width={110}>{student.ref}</Column>
            <Column width={200}>
              {student.lastName} {student.firstName}
            </Column>
            <Column width={60}>{capitalizeText(student.gender)}</Column>
            <StudentMarkList academy={student.currentAcademy?._id} student={student._id} subject={subject} scores={student?.currentAcademy?.scores} buttonRef={refs?.[key + 1]?.children?.[4]?.children?.[1]} index={key} option={option} onChangeOption={handleChangeOption} classId={classId} />
            <TextLabel width={50} label='score'>{calculateTotalScore(student?.currentAcademy?.scores, subject)}</TextLabel>
          </div>
        )
      })}
    </div>
  )
}
