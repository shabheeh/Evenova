import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Users,
  Plus,
  X,
  Gavel,
  AlertCircle,
} from "lucide-react";
import { EVENT_CATEGORY } from "@/constants/events";
import { DateTimePicker } from "../common/DateTimePicker";
import {
  createEventSchema,
  type CreateEventFormData,
} from "@/types/event.types";
import { createEvent } from "@/services/eventService";
import { ImageSearch } from "../common/ImageSearch";

export function CreateEventForm() {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateEventFormData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      category: "",
      isOnline: false,
      needJudges: false,
      tickets: [
        {
          name: "General Admission",
          price: "",
          quantity: "",
          foodIncluded: false,
        },
      ],
      judges: [],
    },
  });

  const {
    fields: ticketFields,
    append: appendTicket,
    remove: removeTicket,
  } = useFieldArray({
    control,
    name: "tickets",
  });

  const {
    fields: judgeFields,
    append: appendJudge,
    remove: removeJudge,
  } = useFieldArray({
    control,
    name: "judges",
  });

  const isOnline = watch("isOnline");
  const needJudges = watch("needJudges");

  const createEventMutation = useMutation({
    mutationFn: async (data: CreateEventFormData) => {
      await createEvent(data);
    },
    onSuccess: (data) => {
      console.log("Event created successfully:", data);
      toast.success("Event created successfully!");
      reset();
    },
    onError: (error) => {
      console.error("Error creating event:", error);
      toast.error("Failed to create event. Please try again.");
    },
  });

  const addTicketType = () => {
    if (ticketFields.length < 3) {
      appendTicket({ name: "", price: "", quantity: "", foodIncluded: false });
    }
  };

  const addJudge = () => {
    if (judgeFields.length < 4) {
      appendJudge({ name: "", email: "", expertise: "", bio: "" });
    }
  };

  const onSubmit = (data: CreateEventFormData) => {
    createEventMutation.mutate(data);
  };

  const onSaveDraft = (data: CreateEventFormData) => {
    console.log("Saving as draft:", data);
    toast.success("Draft saved successfully!");
  };

  const onDiscard = () => {
    reset();
    toast.success("Form cleared successfully!");
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-emerald-600" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Event Name *</Label>
                <Input
                  id="title"
                  {...register("title")}
                  placeholder="Enter event name"
                />
                {errors.title && (
                  <p className="text-sm text-red-500">
                    {errors.title.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(EVENT_CATEGORY).map(
                          ([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && (
                  <p className="text-sm text-red-500">
                    {errors.category.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Describe your event..."
                className="min-h-32"
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Event Image *</Label>
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <ImageSearch
                    onImageSelect={(imageUrl) => {
                      field.onChange(imageUrl);
                    }}
                    currentImage={field.value}
                  />
                )}
              />
              {errors.image && (
                <p className="text-sm text-red-500">{errors.image.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-emerald-600" />
              Date & Time
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="startDateTime">Start Date & Time *</Label>
                <Controller
                  name="startDateTime"
                  control={control}
                  render={({ field }) => (
                    <DateTimePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select start date and time"
                      hourCycle={12}
                    />
                  )}
                />
                {errors.startDateTime && (
                  <p className="text-sm text-red-500">
                    {errors.startDateTime.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDateTime">End Date & Time *</Label>
                <Controller
                  name="endDateTime"
                  control={control}
                  render={({ field }) => (
                    <DateTimePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select end date and time"
                      hourCycle={12}
                    />
                  )}
                />
                {errors.endDateTime && (
                  <p className="text-sm text-red-500">
                    {errors.endDateTime.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-emerald-600" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-2">
              <Controller
                name="isOnline"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="online-event"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={true}
                  />
                )}
              />
              <Label htmlFor="online-event" className="text-muted-foreground">
                This is an online event (Coming Soon)
              </Label>
            </div>

            {!isOnline && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="venue">Venue Name *</Label>
                  <Input
                    id="venue"
                    {...register("location.venue")}
                    placeholder="Enter venue name"
                  />
                  {errors.location?.venue && (
                    <p className="text-sm text-red-500">
                      {errors.location.venue.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    {...register("location.address")}
                    placeholder="Enter full address"
                  />
                  {errors.location?.address && (
                    <p className="text-sm text-red-500">
                      {errors.location.address.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      {...register("location.city")}
                      placeholder="City"
                    />
                    {errors.location?.city && (
                      <p className="text-sm text-red-500">
                        {errors.location.city.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      {...register("location.state")}
                      placeholder="State"
                    />
                    {errors.location?.state && (
                      <p className="text-sm text-red-500">
                        {errors.location.state.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code *</Label>
                    <Input
                      id="zip"
                      {...register("location.zip")}
                      placeholder="ZIP"
                    />
                    {errors.location?.zip && (
                      <p className="text-sm text-red-500">
                        {errors.location.zip.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-emerald-600" />
              Tickets
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {ticketFields.map((field, index) => (
              <div key={field.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Ticket Type {index + 1}</h4>
                  {ticketFields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTicket(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Ticket Name *</Label>
                    <Input
                      {...register(`tickets.${index}.name`)}
                      placeholder="e.g., General Admission"
                    />
                    {errors.tickets?.[index]?.name && (
                      <p className="text-sm text-red-500">
                        {errors.tickets[index]?.name?.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Price ($) *</Label>
                    <Input
                      type="number"
                      {...register(`tickets.${index}.price`)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                    {errors.tickets?.[index]?.price && (
                      <p className="text-sm text-red-500">
                        {errors.tickets[index]?.price?.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Quantity *</Label>
                    <Input
                      type="number"
                      {...register(`tickets.${index}.quantity`)}
                      placeholder="100"
                      min="1"
                    />
                    {errors.tickets?.[index]?.quantity && (
                      <p className="text-sm text-red-500">
                        {errors.tickets[index]?.quantity?.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Controller
                    name={`tickets.${index}.foodIncluded`}
                    control={control}
                    render={({ field }) => (
                      <Switch
                        id={`food-included-${index}`}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                  <Label htmlFor={`food-included-${index}`}>
                    Food included
                  </Label>
                </div>
              </div>
            ))}

            {ticketFields.length < 3 && (
              <Button
                type="button"
                variant="outline"
                onClick={addTicketType}
                className="w-full bg-transparent"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Ticket Type
              </Button>
            )}

            {ticketFields.length >= 3 && (
              <p className="text-sm text-muted-foreground text-center">
                Maximum of 3 ticket types allowed
              </p>
            )}

            {errors.tickets && typeof errors.tickets.message === "string" && (
              <p className="text-sm text-red-500">{errors.tickets.message}</p>
            )}
          </CardContent>
        </Card>


        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gavel className="h-5 w-5 text-emerald-600" />
              Judges
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-2">
              <Controller
                name="needJudges"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="need-judges"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="need-judges">This event needs judges</Label>
            </div>

            {needJudges && (
              <div className="space-y-4">
                {judgeFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="border rounded-lg p-4 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Judge {index + 1}</h4>
                      {judgeFields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeJudge(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Judge Name *</Label>
                        <Input
                          {...register(`judges.${index}.name`)}
                          placeholder="Enter judge name"
                        />
                        {errors.judges?.[index]?.name && (
                          <p className="text-sm text-red-500">
                            {errors.judges[index]?.name?.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Email *</Label>
                        <Input
                          type="email"
                          {...register(`judges.${index}.email`)}
                          placeholder="judge@example.com"
                        />
                        {errors.judges?.[index]?.email && (
                          <p className="text-sm text-red-500">
                            {errors.judges[index]?.email?.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Expertise *</Label>
                      <Input
                        {...register(`judges.${index}.expertise`)}
                        placeholder="e.g., Music, Technology, Art"
                      />
                      {errors.judges?.[index]?.expertise && (
                        <p className="text-sm text-red-500">
                          {errors.judges[index]?.expertise?.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Bio (Optional)</Label>
                      <Textarea
                        {...register(`judges.${index}.bio`)}
                        placeholder="Brief bio of the judge..."
                        className="min-h-20"
                      />
                    </div>
                  </div>
                ))}

                {judgeFields.length < 4 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addJudge}
                    className="w-full bg-transparent"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Judge
                  </Button>
                )}

                {judgeFields.length >= 4 && (
                  <p className="text-sm text-muted-foreground text-center">
                    Maximum of 4 judges allowed
                  </p>
                )}

                {errors.judges && typeof errors.judges.message === "string" && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.judges.message}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-emerald-600" />
              Additional Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="capacity">Event Capacity *</Label>
              <Input
                id="capacity"
                type="number"
                {...register("capacity")}
                placeholder="Maximum attendees"
                min="1"
              />
              {errors.capacity && (
                <p className="text-sm text-red-500">
                  {errors.capacity.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Must be equal to total ticket quantities
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags *</Label>
              <Input
                id="tags"
                {...register("tags")}
                placeholder="music, concert, live (comma separated)"
              />
              {errors.tags && (
                <p className="text-sm text-red-500">{errors.tags.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onDiscard}
            disabled={isSubmitting}
          >
            Discard
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={handleSubmit(onSaveDraft)}
            disabled={isSubmitting}
          >
            Save as Draft
          </Button>
          <Button
            type="submit"
            size="lg"
            className="bg-emerald-600 hover:bg-emerald-700"
            disabled={isSubmitting || createEventMutation.isPending}
          >
            {createEventMutation.isPending ? "Publishing..." : "Publish Event"}
          </Button>
        </div>
      </form>
    </>
  );
}
