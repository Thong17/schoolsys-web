import useTheme from "hooks/useTheme"
import { TextHighlight } from "./TextHighlight"

export const AverageHighlight = ({calculatedAverage, subjects=[{ passScore: 50, fullScore: 100 }]}) => {
    const { theme } = useTheme()
    let passScore = 0
    let fullScore = 0

    subjects.forEach(subject => {
      passScore += subject.passScore
      fullScore += subject.fullScore
    })

    const passAverage = passScore / subjects?.length
    const fullAverage = fullScore / subjects?.length
    
    const warningAverage = passAverage + ((fullAverage - passAverage) / 4)
    const normalAverage = warningAverage + ((fullAverage - passAverage) / 3)
  
    switch (true) {
      case calculatedAverage < passAverage:
        return <TextHighlight text={calculatedAverage} color={theme.color.error} />
      case calculatedAverage < warningAverage:
        return <TextHighlight text={calculatedAverage} color={theme.color.warning} />
      case calculatedAverage < normalAverage:
        return <TextHighlight text={calculatedAverage} color={theme.color.info} />
      case calculatedAverage < fullAverage:
        return <TextHighlight text={calculatedAverage} color={theme.color.success} />
      default:
        return <TextHighlight text={calculatedAverage} color={theme.text.secondary} />
    }
  }