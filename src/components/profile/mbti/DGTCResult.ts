export interface DGTCResultData {
  id: string;
  type: string;
  title: string;
  result: string;
  scores?: { [key: string]: number };
  clarity?: { [key: string]: string };
  percent?: { [key: string]: string };
  started_at: string;
  submitted_at: string;
}