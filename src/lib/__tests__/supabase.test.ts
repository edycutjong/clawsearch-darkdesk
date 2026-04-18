/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase, createServerClient, getSweepById, getAllSweeps, insertSweep, insertLog, updateSweepStatus, deleteLogsBySweepId } from '../supabase';
import { createClient } from '@supabase/supabase-js';

jest.mock('@supabase/supabase-js', () => {
    const mockSelect = jest.fn().mockReturnThis();
    const mockEq = jest.fn().mockReturnThis();
    const mockSingle = jest.fn().mockResolvedValue({ data: { id: '1' }, error: null });
    const mockOrder = jest.fn().mockResolvedValue({ data: [{ id: '1' }], error: null });
    const mockInsert = jest.fn().mockReturnThis();
    const mockUpdate = jest.fn().mockReturnThis();
    const mockDelete = jest.fn().mockReturnThis();
    
    const mockFrom = jest.fn(() => ({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
        order: mockOrder,
        insert: mockInsert,
        update: mockUpdate,
        delete: mockDelete,
    }));
    
    return {
        createClient: jest.fn(() => ({
            from: mockFrom
        }))
    };
});

describe('Supabase utils', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('exports supabase client', () => {
        expect(supabase).toBeDefined();
    });

    it('creates server client', () => {
        expect(createServerClient()).toBeDefined();
        expect(createClient).toHaveBeenCalled();
    });

    it('getSweepById', async () => {
        const res = await getSweepById('1');
        expect(res.data).toEqual({ id: '1' });
    });

    it('getAllSweeps', async () => {
        const res = await getAllSweeps();
        expect(res.data).toEqual([{ id: '1' }]);
    });

    it('insertSweep', async () => {
        // mock return structure for single() in insert chain
        const client = createServerClient() as any;
        client.from().insert().select().single.mockResolvedValueOnce({ data: { id: '1' }, error: null });
        
        const res = await insertSweep({ repo_url: 'test', repo_name: 'test', status: 'testing' } as any);
        expect(res.data).toEqual({ id: '1' });
    });

    it('insertLog', async () => {
        const client = createServerClient() as any;
        client.from().insert.mockResolvedValueOnce({ error: null });
        
        await insertLog({ sweep_id: '1', level: 'info', message: 'test' } as any);
        expect(client.from().insert).toHaveBeenCalled();
    });

    it('updateSweepStatus', async () => {
        const client = createServerClient() as any;
        client.from().update().eq.mockResolvedValueOnce({ error: null });
        
        await updateSweepStatus('1', 'completed' as any, { extra: 'val' });
        expect(client.from().update).toHaveBeenCalled();
    });

    it('deleteLogsBySweepId success', async () => {
        const client = createServerClient() as any;
        client.from().delete().eq.mockResolvedValueOnce({ error: null });
        
        const res = await deleteLogsBySweepId('1');
        expect(res.error).toBeNull();
    });

    it('deleteLogsBySweepId error', async () => {
        const err = new Error('db err');
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
        const client = createServerClient() as any;
        client.from().delete().eq.mockResolvedValueOnce({ error: err });
        
        const res = await deleteLogsBySweepId('1');
        expect(res.error).toBe(err);
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    });
});
