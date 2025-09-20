import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Dumbbell, 
  Wind, 
  Brain, 
  Heart, 
  Sparkles,
  Play,
  Clock,
  Award
} from 'lucide-react';

const exerciseCategories = [
  {
    key: 'breathing',
    icon: Wind,
    gradient: 'bg-gradient-calm',
    exercises: [
      { name: 'Box Breathing', duration: 5, xp: 15, difficulty: 'Beginner' },
      { name: '4-7-8 Breathing', duration: 8, xp: 20, difficulty: 'Intermediate' },
      { name: 'Alternate Nostril', duration: 10, xp: 25, difficulty: 'Advanced' }
    ]
  },
  {
    key: 'meditation',
    icon: Brain,
    gradient: 'bg-gradient-focus',
    exercises: [
      { name: 'Body Scan', duration: 15, xp: 30, difficulty: 'Beginner' },
      { name: 'Loving Kindness', duration: 20, xp: 40, difficulty: 'Intermediate' },
      { name: 'Mindful Walking', duration: 25, xp: 50, difficulty: 'Advanced' }
    ]
  },
  {
    key: 'mindfulness',
    icon: Sparkles,
    gradient: 'bg-gradient-primary',
    exercises: [
      { name: '5-4-3-2-1 Grounding', duration: 5, xp: 15, difficulty: 'Beginner' },
      { name: 'Mindful Eating', duration: 15, xp: 25, difficulty: 'Intermediate' },
      { name: 'Present Moment Awareness', duration: 10, xp: 20, difficulty: 'Intermediate' }
    ]
  },
  {
    key: 'gratitude',
    icon: Heart,
    gradient: 'bg-gradient-energy',
    exercises: [
      { name: 'Three Good Things', duration: 5, xp: 10, difficulty: 'Beginner' },
      { name: 'Gratitude Letter', duration: 15, xp: 30, difficulty: 'Intermediate' },
      { name: 'Appreciation Meditation', duration: 12, xp: 25, difficulty: 'Intermediate' }
    ]
  }
];

export default function Exercises() {
  const { t } = useTranslation();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const startExercise = (exerciseName: string) => {
    // Here you would start the exercise
    console.log('Starting exercise:', exerciseName);
  };

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-focus rounded-full flex items-center justify-center">
            <Dumbbell className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('exercises.title')}</h1>
            <p className="text-muted-foreground">Strengthen your mind with guided exercises</p>
          </div>
        </div>
      </motion.div>

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="glass">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">47</div>
                <div className="text-sm text-muted-foreground">Exercises Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">128</div>
                <div className="text-sm text-muted-foreground">Minutes Practiced</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">15</div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Exercise Categories */}
      <div className="space-y-8">
        {exerciseCategories.map((category, categoryIndex) => (
          <motion.div
            key={category.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + categoryIndex * 0.1 }}
          >
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${category.gradient} rounded-lg flex items-center justify-center`}>
                    <category.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="capitalize">{t(`exercises.${category.key}`)}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.exercises.map((exercise, exerciseIndex) => (
                    <motion.div
                      key={exercise.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + exerciseIndex * 0.1 }}
                      className="border border-border/20 rounded-lg p-4 hover:shadow-medium transition-all duration-200 hover-lift"
                    >
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-medium text-foreground">{exercise.name}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getDifficultyColor(exercise.difficulty)}`}
                            >
                              {exercise.difficulty}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{exercise.duration} min</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Award className="w-3 h-3" />
                            <span>{exercise.xp} XP</span>
                          </div>
                        </div>

                        <Button
                          onClick={() => startExercise(exercise.name)}
                          className={`w-full ${category.gradient} text-white hover:opacity-90 shadow-soft`}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Start Exercise
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Daily Challenge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="glass border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span>Today's Challenge</span>
              <Badge className="bg-primary text-white">+50 XP</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Complete 3 Different Exercise Types</h3>
                <p className="text-sm text-muted-foreground">
                  Practice one breathing, meditation, and mindfulness exercise to earn bonus XP!
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>1/3</span>
                </div>
                <Progress value={33} className="h-2" />
              </div>

              <div className="flex space-x-2">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-xs">Breathing ✓</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span className="text-xs">Meditation</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span className="text-xs">Mindfulness</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}