import Button from "~/components/ui/Button";
import { Card } from "~/app/(app)/dashboard/inventory/_components/Card";
export interface CustomEmptyState {
  customContent?: {
    title: string;
    text: string;
    newButtonRoute: string;
    newButtonContent: string;
    buttonProps?: any;
  };
  modelName?: {
    singular: string;
    plural: string;
  };
}
export const EmptyState = ({ customContent, modelName }: CustomEmptyState) => {
  const texts = {
    title: `No Whatever found`,
    p: `What are you waiting for? Create your first object now!`,
  };

  return (
    <Card>
      <div className="flex h-full flex-col justify-center gap-[32px] px-4 py-[100px] text-center">
        <div className="flex flex-col items-center">
          <img
            src="/static/images/empty-state.svg"
            alt="Empty state"
            className="h-auto w-[172px]"
          />
          {customContent ? (
            <div>
              <div className="text-text-lg font-semibold text-gray-900">
                {customContent.title}
              </div>
              <p>{customContent.text}</p>
            </div>
          ) : (
            <div>
              <div className="text-text-lg font-semibold text-gray-900">
                {texts.title}
              </div>
              <p>{texts.p}</p>
            </div>
          )}
        </div>
        <div className="flex justify-center gap-3">
          {/* {search && (
          <ClearSearch
            buttonProps={{
              variant: "secondary",
            }}
          >
            Clear Search
          </ClearSearch>
        )} */}
          <Button
            to={
              customContent?.newButtonRoute
                ? customContent.newButtonRoute
                : "new"
            }
            icon="plus"
            {...(customContent?.buttonProps || undefined)}
          >
            {customContent?.newButtonContent
              ? customContent.newButtonContent
              : `New whatever`}
          </Button>
        </div>
      </div>
    </Card>
  );
};
