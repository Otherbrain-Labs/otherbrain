import { Model } from "@/app/[authorSlug]/[modelSlug]/page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Review from "./review";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

function Reviews({ model }: { model: Model }) {
  return (
    <>
      {model.reviews.length === 0 ? (
        <div className="text-sm text-muted-foreground ml-2">No reviews yet</div>
      ) : (
        <div className="space-y-3 mt-4">
          {model.reviews.map((review) => (
            <Review key={review.id} review={review} />
          ))}
        </div>
      )}
    </>
  );
}

function Samples({ model }: { model: Model }) {
  return (
    <>
      {model.humanFeedback.length === 0 ? (
        <div className="text-sm text-muted-foreground ml-2">No samples yet</div>
      ) : (
        <div>
          {model.humanFeedback.map((humanFeedback) => (
            <div
              key={humanFeedback.id}
              className="mt-4 border border-dashed rounded p-4 space-y-2 text-xs"
            >
              <div className="font-bold">System prompt</div>
              <Markdown className="prose prose-sm" remarkPlugins={[remarkGfm]}>
                {humanFeedback.lastSystemPrompt}
              </Markdown>
              {humanFeedback.messages
                .sort((a, b) => a.index - b.index)
                .map((message) => (
                  <div key={message.id} className="space-y-2">
                    <div className="font-bold">
                      {message.fromUser ? "Human" : "Bot"}
                    </div>
                    <Markdown
                      className="prose prose-sm"
                      remarkPlugins={[remarkGfm]}
                    >
                      {message.text}
                    </Markdown>
                  </div>
                ))}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default function ReviewsAndSamples({ model }: { model: Model }) {
  return (
    <Tabs defaultValue="reviews" className="mt-10">
      <TabsList className="mb-2">
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
        <TabsTrigger value="samples">Samples</TabsTrigger>
      </TabsList>
      <TabsContent value="reviews">
        <Reviews model={model} />
      </TabsContent>
      <TabsContent value="samples">
        <Samples model={model} />
      </TabsContent>
    </Tabs>
  );
}
