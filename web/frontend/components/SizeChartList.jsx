import React from 'react';
import { Page, Card, ResourceList, ResourceItem, Avatar, TextStyle } from '@shopify/polaris';

class SizeChartList extends React.Component {
    // State to hold size charts
    state = {
        sizeCharts: [
            // This should be filled with size chart data, potentially fetched from an API
            { id: '123', name: 'Men’s T-Shirts', updated_at: 'July 20, 2021' },
            { id: '124', name: 'Women’s T-Shirts', updated_at: 'August 15, 2021' },
            // Add more size chart objects here
        ],
    };

    render() {
        return (
            <Page title="Size Charts">
                <Card sectioned>
                    <ResourceList
                        showHeader
                        resourceName={{ singular: 'size chart', plural: 'size charts' }}
                        items={this.state.sizeCharts}
                        renderItem={(sizeChart) => {
                            const { id, name, updated_at } = sizeChart;
                            const shortcutActions = [
                                { content: 'Edit', url: `/sizecharts/${id}/edit` },
                                { content: 'Delete', url: `/sizecharts/${id}/delete`, destructive: true },
                            ];

                            return (
                                <ResourceItem
                                    id={id}
                                    accessibilityLabel={`View details for ${name}`}
                                    shortcutActions={shortcutActions}
                                    persistActions
                                >
                                    <h3>
                                        <TextStyle variation="strong">{name}</TextStyle>
                                    </h3>
                                    <div>Last updated at {updated_at}</div>
                                </ResourceItem>
                            );
                        }}
                    />
                </Card>
            </Page>
        );
    }
}

export default SizeChartList;
