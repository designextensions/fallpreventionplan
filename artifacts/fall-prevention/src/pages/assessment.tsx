import { useState } from "react";
import { Link } from "wouter";
import { 
  useGetAssessmentQuestions, 
  useSubmitAssessment,
  getGetAssessmentQuestionsQueryKey 
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, ShieldAlert, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import type { AssessmentResult } from "@workspace/api-client-react/src/generated/api.schemas";

export function Assessment() {
  const { data: questions, isLoading, isError } = useGetAssessmentQuestions({
    query: { queryKey: getGetAssessmentQuestionsQueryKey() }
  });
  const submitAssessment = useSubmitAssessment();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<AssessmentResult | null>(null);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <Spinner className="size-8 text-primary" />
      </div>
    );
  }

  if (isError || !questions) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full border-destructive">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h3 className="font-serif text-2xl font-bold mb-2">Something went wrong</h3>
            <p className="text-muted-foreground mb-6">We couldn't load the assessment questions. Please try again later.</p>
            <Button onClick={() => window.location.reload()} className="min-h-[48px] rounded-full">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = () => {
    const formattedAnswers = Object.entries(answers).map(([questionId, value]) => ({
      questionId,
      value
    }));

    submitAssessment.mutate(
      { data: { answers: formattedAnswers } },
      {
        onSuccess: (data) => {
          setResult(data);
        },
        onError: (err) => {
          console.error("Failed to submit assessment", err);
        }
      }
    );
  };

  const currentQuestion = questions[currentIndex];
  const progress = Math.round((currentIndex / questions.length) * 100);

  if (result) {
    return (
      <div className="flex-1 bg-background py-12 md:py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <Card className="border-t-8 shadow-xl overflow-hidden" style={{
            borderTopColor: 
              result.level === 'high' ? 'hsl(var(--destructive))' : 
              result.level === 'moderate' ? 'hsl(var(--accent))' : 
              'hsl(var(--primary))'
          }}>
            <CardHeader className="text-center bg-muted/30 pb-8 pt-10">
              {result.level === 'low' && <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />}
              {result.level === 'moderate' && <AlertCircle className="w-16 h-16 text-accent mx-auto mb-4" />}
              {result.level === 'high' && <ShieldAlert className="w-16 h-16 text-destructive mx-auto mb-4" />}
              
              <CardTitle className="font-serif text-3xl md:text-4xl font-bold mb-4">{result.headline}</CardTitle>
              <p className="text-xl text-muted-foreground">{result.summary}</p>
            </CardHeader>
            <CardContent className="p-8 md:p-10">
              <h3 className="font-serif text-2xl font-bold mb-6 border-b border-border pb-2">Recommended Actions</h3>
              <ul className="space-y-4 mb-10">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-4 text-lg bg-muted/20 p-4 rounded-lg">
                    <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>

              <div className="bg-primary/5 rounded-2xl p-8 text-center border border-primary/20">
                <h4 className="font-serif text-2xl font-bold mb-4">Take the next step</h4>
                <p className="text-lg text-muted-foreground mb-8">
                  Get the complete 10-Point Plan to avoid falling, complete with physical therapy exercises and home safety guides.
                </p>
                <Link href="/pricing">
                  <Button size="lg" className="w-full sm:w-auto min-h-[56px] text-lg rounded-full font-bold px-10 shadow-md">
                    View the Program Plans
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background py-12 md:py-20 flex flex-col">
      <div className="container mx-auto px-4 max-w-2xl flex-1 flex flex-col">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="text-sm font-bold text-primary">{progress}%</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        <Card className="flex-1 border-border shadow-lg flex flex-col">
          <CardHeader className="pb-4">
            {currentQuestion.category && (
              <span className="text-sm font-bold text-primary uppercase tracking-wider mb-2 block">
                {currentQuestion.category}
              </span>
            )}
            <CardTitle className="font-serif text-2xl md:text-3xl font-bold leading-tight">
              {currentQuestion.prompt}
            </CardTitle>
            {currentQuestion.helpText && (
              <p className="text-lg text-muted-foreground mt-4 italic border-l-4 border-primary/30 pl-4 py-1">
                {currentQuestion.helpText}
              </p>
            )}
          </CardHeader>
          <CardContent className="flex-1">
            <RadioGroup 
              value={answers[currentQuestion.id] || ""} 
              onValueChange={(val) => setAnswers(prev => ({ ...prev, [currentQuestion.id]: val }))}
              className="space-y-4 mt-6"
            >
              {currentQuestion.options.map((opt) => (
                <div key={opt.value} className="flex items-center space-x-2 border border-border rounded-xl p-2 hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value={opt.value} id={`opt-${opt.value}`} className="w-6 h-6 ml-2" />
                  <Label 
                    htmlFor={`opt-${opt.value}`} 
                    className="flex-1 text-xl py-4 px-2 cursor-pointer leading-relaxed"
                  >
                    {opt.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
          <CardFooter className="pt-6 border-t border-border flex justify-between bg-muted/10 rounded-b-xl">
            <Button 
              variant="ghost" 
              onClick={handleBack} 
              disabled={currentIndex === 0 || submitAssessment.isPending}
              className="min-h-[48px] px-6 text-lg"
            >
              <ArrowLeft className="mr-2 w-5 h-5" /> Back
            </Button>
            
            <Button 
              onClick={handleNext} 
              disabled={!answers[currentQuestion.id] || submitAssessment.isPending}
              className="min-h-[48px] px-8 text-lg rounded-full font-bold"
            >
              {submitAssessment.isPending ? (
                <>Processing... <Spinner className="ml-2 w-5 h-5" /></>
              ) : currentIndex === questions.length - 1 ? (
                "Get Results"
              ) : (
                <>Next <ArrowRight className="ml-2 w-5 h-5" /></>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
