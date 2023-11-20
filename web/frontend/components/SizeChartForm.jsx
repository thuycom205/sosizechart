import { Page, Form, FormLayout, TextField, ChoiceList, Button } from '@shopify/polaris';

export  default function SizeChartForm() {
    // State and handlers would be here

    return (
        <Page title="Size Chart">
            <Form >
                <FormLayout>
                    <TextField label="Height" /* more props */ />
                    <TextField label="Chest/Bust" /* more props */ />
                    <TextField label="Waist" /* more props */ />
                    <TextField label="Hips" /* more props */ />

                    <Button submit>Submit</Button>
                </FormLayout>
            </Form>
        </Page>
    );
}
