import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export function GET(
  _request: Request,
  { params }: { params: { feedbackId: string } }
) {
  const { feedbackId } = params;
  const [numIdString, secret] = feedbackId.split("_");
  const numId = parseInt(numIdString, 10);

  cookies().set(`edit-key-${numId}`, secret, {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  redirect(`/human-feedback/${numId}?label=true`);
}
