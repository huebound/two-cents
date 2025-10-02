import { TeachForm } from "./teach-form";

export default function TeachPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-gray-900">Teach a class</h1>
        <p className="text-sm text-gray-600">
          Share your skill with the club. Fill in the details below to publish your class.
        </p>
      </div>
      <TeachForm />
    </div>
  );
}
