import {
  SchemaComponent,
  SchemaInitializerItem,
  useSchemaInitializer,
  useSchemaInitializerItem,
} from '@nocobase/client';
import { Tabs } from 'antd';
import React from 'react';
import { TransportsTable } from './Transports';
import { EmailLogsTable } from './EmailLogs';
import { useTransportsResource } from './hooks';

const { TabPane } = Tabs;

const AddNewTransportInitializer = () => {
  const itemConfig = useSchemaInitializerItem();
  const { insert } = useSchemaInitializer();
  const resource = useTransportsResource();

  return (
    <SchemaInitializerItem
      {...itemConfig}
      onClick={async () => {
        const values = await resource.create({ values: {} });
        insert(values.data.data);
      }}
    />
  );
};

export const EmailManagerProvider: React.FC = (props) => {
  return (
    <div>
      <Tabs defaultActiveKey="transports">
        <TabPane tab="Transports" key="transports">
          <AddNewTransportInitializer />
          <TransportsTable />
        </TabPane>
        <TabPane tab="Email Logs" key="logs">
          <EmailLogsTable />
        </TabPane>
      </Tabs>
    </div>
  );
};
