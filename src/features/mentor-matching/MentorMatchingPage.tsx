import React, { useEffect, useState } from 'react'
import {
  alpha,
  Autocomplete,
  Avatar,
  Button,
  Chip,
  LinearProgress,
  styled,
  TextField,
  Typography,
} from '@mui/material'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import SearchIcon from '@mui/icons-material/Search'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { axiosInstance } from '../../api'
import { InterestArea } from '../../types/User'
import { Loader } from '../common/Loader'

interface MentorRecommendation {
  mentorId: number
  mentorName: string
  mentorEmail: string
  description: string | null
  compatibilityScore: number
  matchReasons: string[]
  interestAreas: InterestArea[]
  announcementCount: number
}

interface MatchResponse {
  recommendations: MentorRecommendation[]
  aiSummary: string
}

const MentorMatchingPage: React.FC = () => {
  const [interestAreaOptions, setInterestAreaOptions] = useState<InterestArea[]>([])
  const [selectedInterests, setSelectedInterests] = useState<InterestArea[]>([])
  const [goalsDescription, setGoalsDescription] = useState('')
  const [learningStyle, setLearningStyle] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<MatchResponse | null>(null)
  const [acceptedMentors, setAcceptedMentors] = useState<Set<number>>(new Set())

  useEffect(() => {
    fetchInterestAreas()
  }, [])

  const fetchInterestAreas = async () => {
    try {
      const response = await axiosInstance.get('/interest-areas')
      setInterestAreaOptions(response.data || [])
    } catch {
      // Silent
    }
  }

  const handleSearch = async () => {
    if (selectedInterests.length === 0) return
    setLoading(true)
    try {
      const response = await axiosInstance.post('/mentor-matching/recommendations', {
        interestAreaIds: selectedInterests.map(ia => ia.id),
        goalsDescription,
        learningStyle,
        preferredSchedule: '',
      })
      setResults(response.data)
    } catch {
      // Handle error
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptMentor = async (mentorId: number) => {
    try {
      await axiosInstance.post(`/mentor-matching/${mentorId}/accept`)
      setAcceptedMentors(prev => new Set(prev).add(mentorId))
    } catch {
      // Handle error
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 70) return '#00D68F'
    if (score >= 40) return '#FFAA00'
    return '#FF4C6A'
  }

  return (
    <Container>
      <HeaderSection>
        <HeaderIcon>
          <AutoAwesomeIcon sx={{ fontSize: 32, color: '#6C63FF' }} />
        </HeaderIcon>
        <PageTitle variant="h4">Find Your Perfect Mentor</PageTitle>
        <PageSubtitle>
          Tell us about your interests and goals, and we'll match you with the best mentors
        </PageSubtitle>
      </HeaderSection>

      <SearchCard>
        <FormGrid>
          <Autocomplete
            multiple
            options={interestAreaOptions}
            getOptionLabel={option => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={selectedInterests}
            onChange={(_, newValue) => setSelectedInterests(newValue)}
            filterSelectedOptions
            renderInput={params => (
              <TextField
                {...params}
                label="Interest Areas"
                placeholder="Select your interests..."
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
          <TextField
            label="Your Learning Goals"
            placeholder="What do you want to achieve? (e.g., learn web development, prepare for interviews...)"
            value={goalsDescription}
            onChange={e => setGoalsDescription(e.target.value)}
            multiline
            rows={3}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Preferred Learning Style"
            placeholder="How do you learn best? (e.g., hands-on projects, theory first, pair programming...)"
            value={learningStyle}
            onChange={e => setLearningStyle(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </FormGrid>
        <SearchButton
          variant="contained"
          onClick={handleSearch}
          disabled={selectedInterests.length === 0 || loading}
          startIcon={<SearchIcon />}
        >
          {loading ? 'Finding mentors...' : 'Find Mentors'}
        </SearchButton>
      </SearchCard>

      {loading && (
        <LoadingSection>
          <LinearProgress
            sx={{
              borderRadius: 4,
              height: 6,
              background: alpha('#6C63FF', 0.1),
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(135deg, #6C63FF 0%, #FF6B9D 100%)',
                borderRadius: 4,
              },
            }}
          />
          <Typography sx={{ color: '#9B9BB4', textAlign: 'center', mt: 2 }}>
            Analyzing mentors and calculating compatibility...
          </Typography>
        </LoadingSection>
      )}

      {results && (
        <ResultsSection>
          <AISummaryCard>
            <AutoAwesomeIcon sx={{ color: '#9D97FF', fontSize: 20 }} />
            <Typography sx={{ color: '#E8E8F0', fontSize: '0.9rem', lineHeight: 1.6 }}>
              {results.aiSummary}
            </Typography>
          </AISummaryCard>

          <ResultsGrid>
            {results.recommendations.map((mentor, idx) => (
              <MentorCard key={mentor.mentorId}>
                <CardRank>#{idx + 1}</CardRank>
                <CardHeader>
                  <MentorAvatar>{mentor.mentorName.charAt(0)}</MentorAvatar>
                  <MentorInfo>
                    <MentorName>{mentor.mentorName}</MentorName>
                    <MentorEmail>{mentor.mentorEmail}</MentorEmail>
                  </MentorInfo>
                  <ScoreBadge scoreColor={getScoreColor(mentor.compatibilityScore)}>
                    {Math.round(mentor.compatibilityScore)}%
                  </ScoreBadge>
                </CardHeader>

                <ScoreBar>
                  <ScoreBarFill
                    style={{
                      width: `${mentor.compatibilityScore}%`,
                      background: `linear-gradient(90deg, ${getScoreColor(mentor.compatibilityScore)} 0%, ${alpha(getScoreColor(mentor.compatibilityScore), 0.5)} 100%)`,
                    }}
                  />
                </ScoreBar>

                {mentor.description && (
                  <MentorDescription>{mentor.description}</MentorDescription>
                )}

                <ChipsRow>
                  {mentor.interestAreas.map(ia => (
                    <StyledChip key={ia.id} label={ia.name} size="small" />
                  ))}
                  {mentor.announcementCount > 0 && (
                    <StyledChip
                      label={`${mentor.announcementCount} announcement${mentor.announcementCount > 1 ? 's' : ''}`}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </ChipsRow>

                <ReasonsSection>
                  {mentor.matchReasons.map((reason, i) => (
                    <ReasonItem key={i}>
                      <ReasonDot />
                      <Typography sx={{ color: '#9B9BB4', fontSize: '0.8rem' }}>{reason}</Typography>
                    </ReasonItem>
                  ))}
                </ReasonsSection>

                {acceptedMentors.has(mentor.mentorId) ? (
                  <AcceptedButton variant="contained" disabled startIcon={<CheckCircleIcon />}>
                    Request Sent
                  </AcceptedButton>
                ) : (
                  <ConnectButton
                    variant="contained"
                    onClick={() => handleAcceptMentor(mentor.mentorId)}
                    startIcon={<PersonAddIcon />}
                  >
                    Connect with Mentor
                  </ConnectButton>
                )}
              </MentorCard>
            ))}
          </ResultsGrid>

          {results.recommendations.length === 0 && (
            <EmptyResults>
              <Typography sx={{ color: '#9B9BB4' }}>
                No mentors found matching your criteria. Try broadening your interest areas.
              </Typography>
            </EmptyResults>
          )}
        </ResultsSection>
      )}
    </Container>
  )
}

export default MentorMatchingPage

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 24px;
  gap: 32px;
  max-width: 900px;
  margin: 0 auto;
`

const HeaderSection = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;
`

const HeaderIcon = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 20px;
  background: linear-gradient(135deg, ${alpha('#6C63FF', 0.15)} 0%, ${alpha('#FF6B9D', 0.1)} 100%);
`

const PageTitle = styled(Typography)`
  font-weight: 800;
  color: #E8E8F0;
  letter-spacing: -0.02em;
`

const PageSubtitle = styled(Typography)`
  color: #9B9BB4;
  max-width: 500px;
  line-height: 1.5;
`

const SearchCard = styled('div')`
  width: 100%;
  padding: 32px;
  background: ${alpha('#131738', 0.6)};
  border: 1px solid ${alpha('#6C63FF', 0.1)};
  border-radius: 24px;
  backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const FormGrid = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const SearchButton = styled(Button)`
  align-self: center;
  padding: 12px 40px;
  font-size: 1rem;
  background: linear-gradient(135deg, #6C63FF 0%, #FF6B9D 100%);
  border-radius: 14px;
  &:hover {
    background: linear-gradient(135deg, #7B73FF 0%, #FF7DAD 100%);
    box-shadow: 0 12px 30px -8px ${alpha('#6C63FF', 0.5)};
  }
`

const LoadingSection = styled('div')`
  width: 100%;
  padding: 24px 0;
`

const ResultsSection = styled('div')`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const AISummaryCard = styled('div')`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 20px;
  background: linear-gradient(135deg, ${alpha('#6C63FF', 0.08)} 0%, ${alpha('#FF6B9D', 0.04)} 100%);
  border: 1px solid ${alpha('#6C63FF', 0.15)};
  border-radius: 16px;
`

const ResultsGrid = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const MentorCard = styled('div')`
  position: relative;
  padding: 24px;
  background: ${alpha('#131738', 0.6)};
  border: 1px solid ${alpha('#6C63FF', 0.1)};
  border-radius: 20px;
  backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  gap: 14px;
  transition: all 0.3s ease;
  &:hover {
    border-color: ${alpha('#6C63FF', 0.25)};
    box-shadow: 0 16px 32px -8px ${alpha('#6C63FF', 0.12)};
    transform: translateY(-2px);
  }
`

const CardRank = styled('div')`
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #9B9BB4;
  background: ${alpha('#6C63FF', 0.08)};
  padding: 2px 8px;
  border-radius: 6px;
`

const CardHeader = styled('div')`
  display: flex;
  align-items: center;
  gap: 12px;
`

const MentorAvatar = styled(Avatar)`
  width: 48px;
  height: 48px;
  font-size: 1.2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #6C63FF 0%, #FF6B9D 100%);
`

const MentorInfo = styled('div')`
  flex: 1;
`

const MentorName = styled(Typography)`
  font-weight: 700;
  color: #E8E8F0;
  font-size: 1.05rem;
`

const MentorEmail = styled(Typography)`
  color: #9B9BB4;
  font-size: 0.8rem;
`

const ScoreBadge = styled('div')<{ scoreColor: string }>`
  font-size: 1.1rem;
  font-weight: 800;
  color: ${props => props.scoreColor};
  padding: 6px 12px;
  border-radius: 12px;
  background: ${props => alpha(props.scoreColor, 0.12)};
`

const ScoreBar = styled('div')`
  width: 100%;
  height: 4px;
  background: ${alpha('#6C63FF', 0.08)};
  border-radius: 2px;
  overflow: hidden;
`

const ScoreBarFill = styled('div')`
  height: 100%;
  border-radius: 2px;
  transition: width 0.8s ease;
`

const MentorDescription = styled(Typography)`
  color: #9B9BB4;
  font-size: 0.85rem;
  line-height: 1.5;
`

const ChipsRow = styled('div')`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`

const StyledChip = styled(Chip)`
  background: ${alpha('#6C63FF', 0.1)};
  color: #9D97FF;
  border-color: ${alpha('#6C63FF', 0.2)};
  font-size: 0.75rem;
  height: 26px;
`

const ReasonsSection = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const ReasonItem = styled('div')`
  display: flex;
  align-items: center;
  gap: 8px;
`

const ReasonDot = styled('div')`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #6C63FF;
  flex-shrink: 0;
`

const ConnectButton = styled(Button)`
  align-self: flex-start;
  background: linear-gradient(135deg, #6C63FF 0%, #9D97FF 100%);
  border-radius: 12px;
  padding: 8px 24px;
  font-size: 0.85rem;
  &:hover {
    background: linear-gradient(135deg, #7B73FF 0%, #ADA8FF 100%);
    box-shadow: 0 8px 20px -6px ${alpha('#6C63FF', 0.4)};
  }
`

const AcceptedButton = styled(Button)`
  align-self: flex-start;
  background: ${alpha('#00D68F', 0.15)};
  color: #00D68F;
  border-radius: 12px;
  padding: 8px 24px;
  font-size: 0.85rem;
`

const EmptyResults = styled('div')`
  text-align: center;
  padding: 40px;
`
